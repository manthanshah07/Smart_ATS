import re
import spacy
from .constants import ATS_SKILLS_VOCABULARY, ATS_SKILLS_CATEGORIES

_nlp_model = None

def get_nlp():
    global _nlp_model
    if _nlp_model is None:
        try:
            _nlp_model = spacy.load('en_core_web_sm')
        except OSError:
            import subprocess
            import sys
            subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
            _nlp_model = spacy.load('en_core_web_sm')
    return _nlp_model


SECTION_HEADERS_REGEX = (
    r'^(education|academic background|academics|qualifications|educational qualifications|'
    r'experience|work experience|professional experience|employment history|work history|internships?|'
    r'projects|personal projects|academic projects|key projects|selected projects|major projects|'
    r'technical skills|skills & abilities|skills|competencies|areas of expertise|'
    r'certifications?|certificates?|professional certifications?|licenses & certifications?|'
    r'achievements?|awards?|honors?|accomplishments?|'
    r'summary|professional summary|profile|objective|career objective|about me)\b'
)


class NLPExtractor:
    """Extracts structured entities deterministically using heuristics and spaCy."""

    @classmethod
    def extract_entities(cls, raw_text):
        if not raw_text or not raw_text.strip():
            return cls._empty_entities()

        nlp = get_nlp()
        doc = nlp(raw_text[:10000])  # limit doc size for fast parsing

        contact = cls._extract_contact(raw_text, doc)
        skills = cls._extract_skills(raw_text)
        education = cls._extract_education(raw_text)
        experience = cls._extract_experience(raw_text)
        projects = cls._extract_projects(raw_text)
        certs = cls._extract_list_section(raw_text, r'certifications?|certificates?|professional certifications?|licenses & certifications?')
        achievements = cls._extract_list_section(raw_text, r'achievements?|awards?|honors?|accomplishments?')
        summary = cls._extract_summary(raw_text)

        validation = cls._validate_resume(contact, skills, education, experience, projects, summary)

        return {
            "skills": skills,
            "education": education,
            "experience": experience,
            "projects": projects,
            "certifications": certs,
            "achievements": achievements,
            "summary": summary,
            "contact": contact,
            "validation": validation
        }

    @classmethod
    def _empty_entities(cls):
        return {
            "skills": {},
            "education": [],
            "experience": [],
            "projects": [],
            "certifications": [],
            "achievements": [],
            "summary": "",
            "contact": {
                "name": "",
                "email": "",
                "phone": "",
                "location": "",
                "linkedin": "",
                "github": "",
                "portfolio": ""
            },
            "validation": {"is_valid": False, "score": 0, "reason": "Empty text"}
        }

    @classmethod
    def _extract_name(cls, raw_text, doc):
        """
        Extract candidate name from top lines of the resume.
        Avoids section headings, contact strings, and non-name patterns.
        """
        lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
        if not lines:
            return ""

        top_lines = lines[:6]
        
        non_name_indicators = [
            'resume', 'curriculum vitae', 'cv', 'summary', 'profile',
            'contact', 'email', 'phone', 'skills', 'experience', 'education',
            'github', 'linkedin', 'http', 'www', '@', '.com', '.in', '.org'
        ]

        # 1. Fallback heuristic: First clean 2-4 word line that is title/capitalized
        for line in top_lines:
            line_clean = re.sub(r'[,|•\-\–].*', '', line).strip()
            line_lower = line_clean.lower()
            if any(ind in line_lower for ind in non_name_indicators):
                continue
            if re.search(r'\d', line_clean):
                continue

            words = line_clean.split()
            if 2 <= len(words) <= 4:
                if all(re.match(r"^[A-Za-z\.\'-]+$", w) for w in words):
                    if all(w[0].isupper() or w.isupper() or w in ('Dr.', 'Mr.', 'Ms.', 'Mrs.') for w in words):
                        return line_clean

        # 2. Try spaCy PERSON entities from top lines
        top_text = "\n".join(top_lines)
        top_doc = doc if len(raw_text) <= 600 else get_nlp()(top_text)
        for ent in top_doc.ents:
            if ent.label_ == "PERSON":
                cand_name = ent.text.strip()
                cand_lower = cand_name.lower()
                words = cand_name.split()
                if 2 <= len(words) <= 4:
                    if not any(ind in cand_lower for ind in non_name_indicators):
                        if all(re.match(r"^[A-Za-z\.\'-]+$", w) for w in words):
                            return " ".join(words)

        return ""

    @classmethod
    def _extract_contact(cls, raw_text, doc):
        contact = {
            "name": "",
            "email": "",
            "phone": "",
            "location": "",
            "linkedin": "",
            "github": "",
            "portfolio": ""
        }

        # Name
        contact['name'] = cls._extract_name(raw_text, doc)

        # Email
        email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', raw_text)
        if email_match:
            contact['email'] = email_match.group(0).lower().rstrip('.')

        # Phone extraction tailored for international and standard formats
        phone_patterns = [
            r'\+?\d{1,3}[\s.-]?(?:\(?\d{2,5}\)?[\s.-]?)?\d{3,5}[\s.-]?\d{3,5}',
            r'(?:\(?\d{3,5}\)?[\s.-]?)?\d{3,5}[\s.-]?\d{3,5}',
            r'\b\d{10}\b'
        ]
        for p in phone_patterns:
            matches = re.finditer(p, raw_text)
            for m in matches:
                val = m.group(0).strip()
                digit_count = sum(c.isdigit() for c in val)
                if 10 <= digit_count <= 15:
                    contact['phone'] = val
                    break
            if contact['phone']:
                break

        # LinkedIn
        linkedin_match = re.search(r'(?:https?://)?(?:www\.)?linkedin\.com/in/([a-zA-Z0-9_-]+)', raw_text, re.I)
        if linkedin_match:
            contact['linkedin'] = f"https://linkedin.com/in/{linkedin_match.group(1)}"

        # GitHub
        github_match = re.search(r'(?:https?://)?(?:www\.)?github\.com/([a-zA-Z0-9_-]+)', raw_text, re.I)
        if github_match:
            contact['github'] = f"https://github.com/{github_match.group(1)}"

        # Portfolio / Personal Website
        portfolio_match = re.search(
            r'(?:https?://)?(?:www\.)?([a-zA-Z0-9_-]+\.(?:vercel\.app|netlify\.app|github\.io|me|dev|tech|site|co|io))\b',
            raw_text,
            re.I
        )
        if portfolio_match:
            contact['portfolio'] = f"https://{portfolio_match.group(1)}"

        # Location heuristic from top lines or NER GPE
        for ent in doc.ents:
            if ent.label_ in ("GPE", "LOC") and ent.start_char < 1500:
                loc_text = ent.text.strip()
                if len(loc_text) > 2 and not any(c.isdigit() for c in loc_text):
                    contact['location'] = loc_text
                    break

        return contact

    @classmethod
    def _extract_skills(cls, raw_text):
        raw_lower = raw_text.lower()
        categorized = {}
        for alias, canonical in ATS_SKILLS_VOCABULARY.items():
            escaped_alias = re.escape(alias)
            # Use negative lookbehind/lookahead to only match whole words and prevent substring matching like C in Contact
            if re.match(r'^\w+$', alias):
                pattern = r'\b' + escaped_alias + r'\b'
            else:
                pattern = r'(?<![a-zA-Z0-9])' + escaped_alias + r'(?![a-zA-Z0-9])'

            if re.search(pattern, raw_lower):
                category = ATS_SKILLS_CATEGORIES.get(canonical, "other")
                if category not in categorized:
                    categorized[category] = []
                if canonical not in categorized[category]:
                    categorized[category].append(canonical)

        # Sort skills within each category deterministically
        for cat in categorized:
            categorized[cat] = sorted(categorized[cat])

        return categorized

    @classmethod
    def _extract_education(cls, raw_text):
        edu_list = []
        lines = raw_text.split('\n')
        in_edu = False
        current_edu = {}

        degree_regex = (
            r'\b(B\.?Tech(?:nology)?|B\.?E\.?|Bachelor of (?:Engineering|Technology|Science|Computer Applications|Arts)|'
            r'M\.?Tech(?:nology)?|M\.?E\.?|Master of (?:Engineering|Technology|Science|Computer Applications|Arts)|'
            r'B\.?C\.?A\.?|M\.?C\.?A\.?|B\.?Sc\.?|M\.?Sc\.?|B\.?S\.?|M\.?S\.?|'
            r'Ph\.?D\.?|Doctorate|Diploma|Higher Secondary|Class XII|Class X|HSC|SSC)\b'
        )

        date_pattern = (
            r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[a-z]*\s+\d{4}|\d{4})'
            r'\s*(?:-|to|–|—)\s*'
            r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[a-z]*\s+\d{4}|\d{4}|Present|Expected)'
        )

        single_year_pattern = r'\b(20\d{2}|19\d{2})\b'

        for line in lines:
            line_strip = line.strip()
            if not line_strip:
                continue

            if re.match(r'^(education|academic background|academics|qualifications|educational qualifications)$', line_strip, re.I):
                in_edu = True
                continue
            if in_edu and re.match(SECTION_HEADERS_REGEX, line_strip, re.I):
                in_edu = False
                break

            if in_edu:
                degree_match = re.search(degree_regex, line_strip, re.I)
                gpa_match = re.search(r'(?:CGPA|GPA|Score|Percentage)[\s:]*([\d\.]+(?:\s*(?:/\s*10|/\s*4|\%))?)', line_strip, re.I)
                date_match = re.search(date_pattern, line_strip, re.I)

                if degree_match:
                    if current_edu.get("degree"):
                        cls._normalize_edu_item(current_edu)
                        edu_list.append(current_edu)
                        current_edu = {}

                    parts = re.split(r'\||—|-', line_strip)
                    current_edu["degree"] = parts[0].strip()
                    if len(parts) > 1 and not re.search(date_pattern, parts[1]):
                        current_edu["institution"] = parts[1].strip()

                elif gpa_match:
                    current_edu["gpa"] = gpa_match.group(1).strip()
                    current_edu["grade"] = gpa_match.group(0).strip()
                elif date_match:
                    current_edu["duration"] = date_match.group(0).strip()
                    current_edu["year"] = date_match.group(0).strip()
                elif current_edu and not current_edu.get("institution") and not line_strip.startswith('-'):
                    # Heuristic: line with university/college or institute
                    current_edu["institution"] = line_strip
                elif current_edu and not current_edu.get("year"):
                    yr_match = re.search(single_year_pattern, line_strip)
                    if yr_match:
                        current_edu["year"] = yr_match.group(1)

        if current_edu.get("degree") or current_edu.get("institution"):
            cls._normalize_edu_item(current_edu)
            edu_list.append(current_edu)

        return edu_list

    @classmethod
    def _normalize_edu_item(cls, edu):
        if "year" not in edu:
            edu["year"] = edu.get("duration", "")
        if "grade" not in edu:
            edu["grade"] = f"GPA: {edu.get('gpa', '')}" if edu.get('gpa') else ""
        if "gpa" not in edu:
            edu["gpa"] = ""
        if "institution" not in edu:
            edu["institution"] = ""
        if "degree" not in edu:
            edu["degree"] = ""

    @classmethod
    def _extract_experience(cls, raw_text):
        exp_list = []
        lines = raw_text.split('\n')
        in_exp = False
        current_exp = {"responsibilities": []}

        date_pattern = (
            r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[a-z]*\s+\d{4}|\d{2}/\d{2,4}|\d{4})'
            r'\s*(?:-|to|–|—)\s*'
            r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{2}/\d{2,4}|\d{4}|Present|Current)'
        )

        for line in lines:
            line_strip = line.strip()
            if not line_strip:
                continue

            if re.match(r'^(experience|work experience|professional experience|employment history|work history|internships?)$', line_strip, re.I):
                in_exp = True
                continue
            if in_exp and re.match(SECTION_HEADERS_REGEX, line_strip, re.I):
                in_exp = False
                break

            if in_exp:
                date_match = re.search(date_pattern, line_strip, re.I)
                is_bullet = line_strip.startswith('-') or line_strip.startswith('•') or line_strip.startswith('*')

                new_block = date_match and (current_exp.get("duration") or current_exp.get("responsibilities"))

                if new_block:
                    if current_exp.get("company") or current_exp.get("role") or current_exp.get("title"):
                        cls._normalize_exp_item(current_exp)
                        exp_list.append(current_exp)
                        current_exp = {"responsibilities": []}

                if date_match:
                    current_exp["duration"] = date_match.group(0).strip()
                    clean_line = re.sub(date_pattern, '', line_strip, flags=re.I).strip(' |—-,')
                    if clean_line:
                        parts = re.split(r'\||—|-', clean_line)
                        if len(parts) > 1:
                            current_exp["role"] = parts[0].strip()
                            current_exp["title"] = parts[0].strip()
                            current_exp["company"] = parts[1].strip()
                        else:
                            if not current_exp.get("role"):
                                current_exp["role"] = parts[0].strip()
                                current_exp["title"] = parts[0].strip()
                            elif not current_exp.get("company"):
                                current_exp["company"] = parts[0].strip()

                elif not is_bullet:
                    parts = re.split(r'\||—|-', line_strip)
                    if len(parts) > 1:
                        if not current_exp.get("role"):
                            current_exp["role"] = parts[0].strip()
                            current_exp["title"] = parts[0].strip()
                        if not current_exp.get("company"):
                            current_exp["company"] = parts[1].strip()
                    else:
                        if not current_exp.get("role"):
                            current_exp["role"] = line_strip
                            current_exp["title"] = line_strip
                        elif not current_exp.get("company"):
                            current_exp["company"] = line_strip
                else:
                    bullet_text = line_strip.lstrip('-•* ').strip()
                    if bullet_text:
                        current_exp["responsibilities"].append(bullet_text)

        if current_exp.get("company") or current_exp.get("role") or current_exp.get("title"):
            cls._normalize_exp_item(current_exp)
            exp_list.append(current_exp)

        return exp_list

    @classmethod
    def _normalize_exp_item(cls, exp):
        if not exp.get("title") and exp.get("role"):
            exp["title"] = exp["role"]
        if not exp.get("role") and exp.get("title"):
            exp["role"] = exp["title"]
        if "duration" not in exp:
            exp["duration"] = ""
        if "company" not in exp:
            exp["company"] = ""
        exp["description"] = " ".join(exp.get("responsibilities", [])).strip()

    @classmethod
    def _extract_projects(cls, raw_text):
        proj_list = []
        lines = raw_text.split('\n')
        in_proj = False
        current_proj = None

        for line in lines:
            line_strip = line.strip()
            if not line_strip:
                continue

            if re.match(r'^(projects|personal projects|academic projects|key projects|selected projects|major projects)$', line_strip, re.I):
                in_proj = True
                continue
            if in_proj and re.match(SECTION_HEADERS_REGEX, line_strip, re.I):
                in_proj = False
                break

            if in_proj:
                is_bullet = line_strip.startswith('-') or line_strip.startswith('•') or line_strip.startswith('*')
                is_long_text = len(line_strip) > 50

                if not is_bullet and not is_long_text and not line_strip.lower().startswith('tech stack'):
                    if current_proj and current_proj.get("name"):
                        cls._populate_project_technologies(current_proj)
                        proj_list.append(current_proj)

                    parts = re.split(r'\||—|-', line_strip)
                    proj_name = parts[0].strip()
                    desc = parts[1].strip() if len(parts) > 1 else ""

                    current_proj = {
                        "name": proj_name,
                        "title": proj_name,
                        "description": desc,
                        "technologies": [],
                        "live_link": ""
                    }
                elif current_proj:
                    bullet_text = line_strip.lstrip('-•* ').strip()
                    if current_proj["description"]:
                        current_proj["description"] += " " + bullet_text
                    else:
                        current_proj["description"] = bullet_text

                # Look for URLs
                if current_proj:
                    urls = re.findall(r'https?://[^\s]+', line_strip)
                    for url in urls:
                        if not current_proj.get("live_link"):
                            current_proj["live_link"] = url.rstrip('.,;)')

        if current_proj and current_proj.get("name"):
            cls._populate_project_technologies(current_proj)
            proj_list.append(current_proj)

        return proj_list

    @classmethod
    def _populate_project_technologies(cls, project):
        """Deterministically identify technologies from project description and name."""
        text = (project.get("name", "") + " " + project.get("description", "")).lower()
        techs = []
        for alias, canonical in ATS_SKILLS_VOCABULARY.items():
            escaped_alias = re.escape(alias)
            if re.match(r'^\w+$', alias):
                pattern = r'\b' + escaped_alias + r'\b'
            else:
                pattern = r'(?<![a-zA-Z0-9])' + escaped_alias + r'(?![a-zA-Z0-9])'

            if re.search(pattern, text) and canonical not in techs:
                techs.append(canonical)
        project["technologies"] = sorted(techs)

    @classmethod
    def _extract_list_section(cls, raw_text, header_regex):
        results = []
        lines = raw_text.split('\n')
        in_section = False
        for line in lines:
            line_strip = line.strip()
            if not line_strip:
                continue
            if re.match(f'^({header_regex})$', line_strip, re.I):
                in_section = True
                continue
            if in_section and re.match(SECTION_HEADERS_REGEX, line_strip, re.I):
                in_section = False
                break
            if in_section:
                item_text = line_strip.lstrip('-•* ').strip()
                if item_text and item_text not in results:
                    results.append(item_text)
        return results

    @classmethod
    def _extract_summary(cls, raw_text):
        lines = raw_text.split('\n')
        summary = ""
        in_summary = False
        first_paragraph = ""
        seen_header = False

        for line in lines:
            line_strip = line.strip()
            if not line_strip:
                continue

            # Identify first paragraph text before any headers for fallback
            if not seen_header and len(line_strip) > 25:
                if not re.search(r'@[a-zA-Z0-9]', line_strip) and not re.search(r'\d{10}', line_strip):
                    if not re.match(SECTION_HEADERS_REGEX, line_strip, re.I):
                        first_paragraph += line_strip + " "

            if re.match(r'^(summary|professional summary|profile|objective|career objective|about me)$', line_strip, re.I):
                in_summary = True
                seen_header = True
                continue

            if re.match(SECTION_HEADERS_REGEX, line_strip, re.I):
                seen_header = True
                if in_summary:
                    in_summary = False
                    break

            if in_summary:
                summary += line_strip + " "

        if summary.strip():
            return summary.strip()

        # Fallback to first non-contact paragraph if reasonable length
        if first_paragraph.strip() and 20 < len(first_paragraph.strip()) < 500:
            return first_paragraph.strip()

        return ""

    @classmethod
    def _validate_resume(cls, contact, skills, education, experience, projects, summary):
        score = 0
        if contact.get('email') or contact.get('phone'):
            score += 20
        if contact.get('name'):
            score += 10

        # Skills points
        skill_count = sum(len(s) for s in skills.values()) if isinstance(skills, dict) else len(skills)
        if skill_count >= 5:
            score += 25
        elif skill_count > 0:
            score += 15

        if education:
            score += 15
        if experience:
            score += 15
        if projects:
            score += 10
        if summary:
            score += 5

        has_contact = bool(contact.get('email') or contact.get('phone'))
        has_skills = bool(skill_count > 0)
        has_background = bool(education or experience or projects)

        is_valid = has_contact and has_skills and has_background and score >= 40

        if not has_contact:
            reason = "No contact information found."
        elif not has_skills:
            reason = "No canonical skills identified."
        elif not has_background:
            reason = "No professional, project, or educational background found."
        elif score < 40:
            reason = f"Insufficient resume content (score: {score})."
        else:
            reason = "Valid resume structure detected."

        return {
            "score": min(100, score),
            "is_valid": is_valid,
            "reason": reason
        }

