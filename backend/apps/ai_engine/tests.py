import os
import io
try:
    import pymupdf as fitz
except ImportError:
    import fitz
import docx
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.accounts.models import User, Candidate, Recruiter
from apps.accounts.serializers import CandidateProfileSerializer
from apps.companies.models import Company
from apps.jobs.models import Job
from apps.applications.models import Application, AIAnalysis
from apps.ai_engine.parser import ResumeParser
from apps.ai_engine.extractor import NLPExtractor
from apps.ai_engine.embeddings import EmbeddingService
from apps.ai_engine.matcher import ExplainableMatcher
from apps.ai_engine.services import AIPipelineService


class AIUnitTests(TestCase):

    def test_1_pdf_resume_extraction(self):
        """Test PDF resume parsing using in-memory PyMuPDF document."""
        doc = fitz.open()
        page = doc.new_page()
        page.insert_text((50, 72), "Alex Morgan\nalex.morgan@example.com\n+1 555-432-8765\nSkills\nPython, Django, React")
        pdf_bytes = doc.tobytes()
        doc.close()

        f = io.BytesIO(pdf_bytes)
        text = ResumeParser.extract_text(f, '.pdf')
        self.assertIn("Alex Morgan", text)
        self.assertIn("alex.morgan@example.com", text)
        self.assertIn("Python", text)

        entities = NLPExtractor.extract_entities(text)
        self.assertEqual(entities["contact"]["name"], "Alex Morgan")
        self.assertEqual(entities["contact"]["email"], "alex.morgan@example.com")
        self.assertIn("Python", entities["skills"].get("languages", []))

    def test_2_docx_resume_extraction(self):
        """Test DOCX resume parsing including paragraph and table text."""
        doc = docx.Document()
        doc.add_paragraph("Sarah Jenkins")
        doc.add_paragraph("sarah.j@example.com | +91 9876543210 | github.com/sarahj")
        doc.add_paragraph("Experience\nSoftware Developer | Acme Systems | 2021 - 2024\n- Built scalable REST APIs using Django.")
        
        table = doc.add_table(rows=1, cols=2)
        table.cell(0, 0).text = "Education"
        table.cell(0, 1).text = "B.Tech Computer Science | National Institute of Tech | 2017 - 2021 | 8.8 CGPA"
        
        f = io.BytesIO()
        doc.save(f)
        f.seek(0)

        text = ResumeParser.extract_text(f, '.docx')
        self.assertIn("Sarah Jenkins", text)
        self.assertIn("sarah.j@example.com", text)
        self.assertIn("Acme Systems", text)
        self.assertIn("National Institute of Tech", text)

        entities = NLPExtractor.extract_entities(text)
        self.assertEqual(entities["contact"]["name"], "Sarah Jenkins")
        self.assertEqual(entities["contact"]["email"], "sarah.j@example.com")
        self.assertEqual(len(entities["experience"]), 1)
        self.assertEqual(entities["experience"][0]["company"], "Acme Systems")

    def test_3_missing_optional_sections(self):
        """Test resume with only contact info and skills, missing optional sections."""
        text = """
        John Doe
        john.doe@test.com
        +1 555-123-4567
        
        Skills
        Python, JavaScript, Docker, Git
        """
        entities = NLPExtractor.extract_entities(text)
        self.assertEqual(entities["contact"]["name"], "John Doe")
        self.assertEqual(entities["education"], [])
        self.assertEqual(entities["experience"], [])
        self.assertEqual(entities["projects"], [])
        self.assertEqual(entities["certifications"], [])
        self.assertEqual(entities["achievements"], [])
        self.assertEqual(entities["summary"], "")
        self.assertIn("Python", entities["skills"].get("languages", []))

    def test_4_multipage_pdf_resume(self):
        """Test multi-page PDF document extraction."""
        doc = fitz.open()
        p1 = doc.new_page()
        p1.insert_text((50, 72), "Dr. Priya Patel\npriya.patel@ai-research.org\nSummary\nExperienced ML researcher.")
        p2 = doc.new_page()
        p2.insert_text((50, 72), "Education\nPh.D. in Computer Science\nStanford University\n2018 - 2023\nSkills\nPython, PyTorch, TensorFlow")
        pdf_bytes = doc.tobytes()
        doc.close()

        f = io.BytesIO(pdf_bytes)
        text = ResumeParser.extract_text(f, '.pdf')
        entities = NLPExtractor.extract_entities(text)

        self.assertEqual(entities["contact"]["name"], "Dr. Priya Patel")
        self.assertIn("ML researcher", entities["summary"])
        self.assertEqual(len(entities["education"]), 1)
        self.assertIn("Ph.D", entities["education"][0]["degree"])
        self.assertIn("PyTorch", entities["skills"].get("ai_ml", []))

    def test_5_skill_aliases_and_deduplication(self):
        """Test aliases: JS, TS, React.js, Node.js, Postgres, Mongo, k8s, dl, nlp."""
        text = """
        Technical Skills
        JS, TS, React.js, Node.js, nodejs, postgresql, Postgres, Mongo, MongoDB,
        k8s, docker, dl, nlp, Scikit-learn, sklearn, C++, Golang, Rust
        Duplicate check: Python, python, PYTHON, JS, JavaScript
        False positive check: Contact, Good, Reacting, Standalone C
        """
        entities = NLPExtractor.extract_entities(text)
        skills = entities["skills"]

        # Canonical normalization
        self.assertIn("JavaScript", skills.get("languages", []))
        self.assertIn("TypeScript", skills.get("languages", []))
        self.assertIn("React", skills.get("frameworks", []))
        self.assertIn("Node.js", skills.get("frameworks", []))
        self.assertIn("PostgreSQL", skills.get("databases", []))
        self.assertIn("MongoDB", skills.get("databases", []))
        self.assertIn("Kubernetes", skills.get("tools", []))
        self.assertIn("Deep Learning", skills.get("ai_ml", []))
        self.assertIn("NLP", skills.get("ai_ml", []))
        self.assertIn("C++", skills.get("languages", []))
        self.assertIn("Go", skills.get("languages", []))
        self.assertIn("Rust", skills.get("languages", []))

        # Check deduplication: JavaScript should only appear once in languages
        self.assertEqual(skills.get("languages", []).count("JavaScript"), 1)
        self.assertEqual(skills.get("languages", []).count("Python"), 1)

    def test_6_experience_with_dates(self):
        """Test internships, software developer roles, date ranges, and Present."""
        text = """
        Work Experience
        Software Engineering Intern
        Google
        Jan 2024 - Present
        - Developed backend microservices with Go and gRPC.
        
        Full Stack Developer | Microsoft | June 2021 - Dec 2023
        - Built frontend web portal using TypeScript and React.
        """
        entities = NLPExtractor.extract_entities(text)
        exp = entities["experience"]
        self.assertEqual(len(exp), 2)

        self.assertEqual(exp[0]["title"], "Software Engineering Intern")
        self.assertEqual(exp[0]["company"], "Google")
        self.assertIn("Jan 2024 - Present", exp[0]["duration"])
        self.assertIn("microservices", exp[0]["description"])

        self.assertEqual(exp[1]["company"], "Microsoft")
        self.assertIn("June 2021 - Dec 2023", exp[1]["duration"])

    def test_7_education_degrees_and_grades(self):
        """Test B.E., B.Tech, MCA, BCA, M.Tech, CGPA, and percentage."""
        text = """
        Education
        Bachelor of Engineering in Information Technology
        Sardar Patel College of Engineering
        2020 - 2024
        CGPA: 8.95 / 10
        
        Master of Computer Applications (MCA)
        Pune University | 2024 - 2026
        Score: 85%
        """
        entities = NLPExtractor.extract_entities(text)
        edu = entities["education"]
        self.assertGreaterEqual(len(edu), 2)

        self.assertIn("Bachelor of Engineering", edu[0]["degree"])
        self.assertEqual(edu[0]["institution"], "Sardar Patel College of Engineering")
        self.assertIn("8.95", edu[0]["gpa"])

        self.assertIn("MCA", edu[1]["degree"])
        self.assertIn("85%", edu[1]["grade"])

    def test_8_contact_coordinates(self):
        """Test candidate name, email, phone, linkedin, github, portfolio."""
        text = """
        Aarav Sharma
        aarav.sharma@example.com | +91 98201 12345 | Mumbai, India
        linkedin.com/in/aarav-sharma-dev | github.com/aaravsharma
        aaravsharma.dev
        
        Summary
        Passionate software engineer building web applications.
        """
        entities = NLPExtractor.extract_entities(text)
        contact = entities["contact"]

        self.assertEqual(contact["name"], "Aarav Sharma")
        self.assertEqual(contact["email"], "aarav.sharma@example.com")
        self.assertIn("98201", contact["phone"])
        self.assertEqual(contact["linkedin"], "https://linkedin.com/in/aarav-sharma-dev")
        self.assertEqual(contact["github"], "https://github.com/aaravsharma")
        self.assertEqual(contact["portfolio"], "https://aaravsharma.dev")

    def test_9_projects_extraction(self):
        """Test project title, description, technologies tagging, and live links."""
        text = """
        Projects
        Smart ATS AI Engine | https://smartats.example.com
        An automated applicant tracking system built with Django, React, PostgreSQL, Docker, and Redis.
        Includes semantic search with Sentence Transformers and spaCy entity extraction.
        
        Cloud Storage Pipeline
        Scalable distributed file upload microservice using AWS S3, Golang, and Kubernetes.
        """
        entities = NLPExtractor.extract_entities(text)
        projects = entities["projects"]
        self.assertEqual(len(projects), 2)

        self.assertEqual(projects[0]["name"], "Smart ATS AI Engine")
        self.assertEqual(projects[0]["live_link"], "https://smartats.example.com")
        self.assertIn("Django", projects[0]["technologies"])
        self.assertIn("React", projects[0]["technologies"])
        self.assertIn("PostgreSQL", projects[0]["technologies"])
        self.assertIn("Docker", projects[0]["technologies"])

        self.assertEqual(projects[1]["name"], "Cloud Storage Pipeline")
        self.assertIn("AWS", projects[1]["technologies"])
        self.assertIn("Kubernetes", projects[1]["technologies"])

    def test_10_malformed_and_empty_input(self):
        """Test empty text, whitespace, or gibberish input without crashing."""
        res_empty = NLPExtractor.extract_entities("")
        self.assertFalse(res_empty["validation"]["is_valid"])
        self.assertEqual(res_empty["skills"], {})
        self.assertEqual(res_empty["education"], [])

        res_spaces = NLPExtractor.extract_entities("   \n\n   \t  ")
        self.assertFalse(res_spaces["validation"]["is_valid"])

        res_none = ResumeParser.extract_text(None, '.pdf')
        self.assertEqual(res_none, "")

    def test_11_candidate_profile_serializer_contract(self):
        """Verify CandidateProfileSerializer exposes all parsed resume fields and identity."""
        user = User.objects.create_user(
            email="candidate.contract@smartats.local",
            password="TestPassword123!",
            first_name="Rohan",
            last_name="Verma"
        )
        candidate = Candidate.objects.create(
            user=user,
            phone="+91 9123456780",
            headline="Full Stack Developer",
            bio="Passionate engineer",
            location="Bengaluru, India",
            parsed_skills={"languages": ["Python", "TypeScript"], "frameworks": ["React", "Django"]},
            parsed_education=[{"degree": "B.Tech", "institution": "IIT", "year": "2020-2024", "grade": "8.9"}],
            parsed_experience=[{"title": "Software Engineer", "company": "Tech Corp", "duration": "2024 - Present"}],
            parsed_projects=[{"name": "ATS Platform", "technologies": ["Django", "React"]}],
            parsed_certifications=["AWS Certified Developer"],
            parsed_achievements=["Hackathon Winner 2023"],
            parsed_summary="Passionate engineer",
            parsed_contact={"name": "Rohan Verma", "email": "candidate.contract@smartats.local", "phone": "+91 9123456780"},
            resume_validation={"score": 85, "is_valid": True, "reason": "Valid resume structure detected."}
        )

        serializer = CandidateProfileSerializer(candidate)
        data = serializer.data

        # Verify identity fields
        self.assertEqual(data["first_name"], "Rohan")
        self.assertEqual(data["last_name"], "Verma")
        self.assertEqual(data["email"], "candidate.contract@smartats.local")
        self.assertEqual(data["name"], "Rohan Verma")

        # Verify parsed fields
        self.assertIn("languages", data["parsed_skills"])
        self.assertEqual(len(data["parsed_education"]), 1)
        self.assertEqual(len(data["parsed_experience"]), 1)
        self.assertEqual(len(data["parsed_projects"]), 1)
        self.assertEqual(len(data["parsed_certifications"]), 1)
        self.assertEqual(len(data["parsed_achievements"]), 1)
        self.assertEqual(data["resume_validation"]["score"], 85)

    def test_12_explainable_matcher_integration(self):
        """Test ExplainableMatcher with structured candidate profile data."""
        user = User.objects.create_user(email="matcher.candidate@test.com", password="Password123!")
        candidate = Candidate.objects.create(
            user=user,
            raw_resume_text="Senior Python and React Engineer with 3 years experience in PostgreSQL and Docker.",
            parsed_skills={"languages": ["Python", "JavaScript"], "frameworks": ["React", "Django"], "databases": ["PostgreSQL"]},
            parsed_experience=[{"duration": "2021 - 2024", "role": "Senior Developer", "company": "Tech Corp"}]
        )

        comp = Company.objects.create(name="Innovate Tech")
        job = Job.objects.create(
            company=comp,
            title="Full Stack Python / React Engineer",
            description="Seeking a software developer with skills in Python, React, and PostgreSQL.",
            required_skills=["Python", "React", "PostgreSQL", "Docker"],
            experience_min_years=3
        )

        result = ExplainableMatcher.calculate_match(candidate, job)

        self.assertGreater(result["overall_match_score"], 50.0)
        self.assertEqual(result["skill_match_score"], 75.0)  # 3 of 4 skills matched
        self.assertEqual(result["experience_match_score"], 100.0)  # 3 years / 3 years
        self.assertIn("Python", result["matched_skills"])
        self.assertIn("Docker", result["missing_skills"])

