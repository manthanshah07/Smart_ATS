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

class NLPExtractor:
    """Extracts structured entities deterministically using heuristics."""

    @classmethod
    def extract_entities(cls, raw_text):
        if not raw_text:
            return cls._empty_entities()

        nlp = get_nlp()
        doc = nlp(raw_text)

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
            "skills": {}, "education": [], "experience": [],
            "projects": [], "certifications": [], "achievements": [],
            "summary": "", "contact": {},
            "validation": {"is_valid": False, "score": 0, "reason": "Empty text"}
        }

    @classmethod
    def _extract_contact(cls, raw_text, doc):
        contact = {}
        email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', raw_text)
        if email_match:
            contact['email'] = email_match.group(0)

        # Phone extraction tailored for international and indian formats.
        # It strictly avoids pure numbers that look like years or floats (e.g. 2026, 3.5).
        # We require either a plus sign or specific groups to qualify.
        phone_patterns = [
            r'(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}[\s-]?\d{3,4}',
            r'\+?\d{1,3}[\s-]?\d{10}',
            r'\d{10}'
        ]
        for p in phone_patterns:
            matches = re.finditer(p, raw_text)
            for m in matches:
                val = m.group(0).strip()
                # Check for validity (min length digits, not matching years)
                digit_count = sum(c.isdigit() for c in val)
                if digit_count >= 10 and digit_count <= 15:
                    contact['phone'] = val
                    break
            if 'phone' in contact:
                break

        linkedin_match = re.search(r'(?:https?://)?(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+', raw_text, re.I)
        if linkedin_match:
            contact['linkedin'] = linkedin_match.group(0)

        github_match = re.search(r'(?:https?://)?(?:www\.)?github\.com/[a-zA-Z0-9_-]+', raw_text, re.I)
        if github_match:
            contact['github'] = github_match.group(0)

        return contact

    @classmethod
    def _extract_skills(cls, raw_text):
        raw_lower = raw_text.lower()
        categorized = {}
        for alias, canonical in ATS_SKILLS_VOCABULARY.items():
            escaped_alias = re.escape(alias)
            # Use negative lookbehind/lookahead to only match whole words and prevent substring matching like C in Contact
            # Handle special characters in alias carefully
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
        return categorized

    @classmethod
    def _extract_education(cls, raw_text):
        edu_list = []
        lines = raw_text.split('\n')
        in_edu = False
        current_edu = {}
        for line in lines:
            line_strip = line.strip()
            if re.match(r'^(education|academic background)', line_strip, re.I):
                in_edu = True
                continue
            if in_edu and re.match(r'^(experience|projects|skills|certifications|achievements|summary|profile)', line_strip, re.I):
                in_edu = False
                break
            if in_edu and line_strip:
                degree_match = re.search(r'\b(B\.?Tech|M\.?Tech|B\.?Sc|M\.?Sc|B\.?A|M\.?A|Ph\.?D|Bachelor|Master)\b.*', line_strip, re.I)
                
                # Check if it has a CGPA
                gpa_match = re.search(r'(?:CGPA|GPA)[\s:]*([\d\.]+)', line_strip, re.I)
                
                # Check for dates
                date_match = re.search(r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)[a-z]*\s+\d{4}|\d{4})\s*(?:-|to|–)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{4}|Present)', line_strip, re.I)

                if degree_match:
                    if current_edu.get("degree"):
                        edu_list.append(current_edu)
                        current_edu = {}
                    
                    # It might be "Degree - Institution | Date"
                    parts = re.split(r'\||—|-', line_strip)
                    current_edu["degree"] = parts[0].strip()
                    if len(parts) > 1 and not date_match:
                        current_edu["institution"] = parts[1].strip()
                        
                elif gpa_match:
                    current_edu["gpa"] = gpa_match.group(1)
                elif date_match:
                    current_edu["duration"] = date_match.group(0)
                elif current_edu and not current_edu.get("institution") and not line_strip.startswith('-'):
                    current_edu["institution"] = line_strip

        if current_edu.get("degree") or current_edu.get("institution"):
            edu_list.append(current_edu)
        return edu_list

    @classmethod
    def _extract_experience(cls, raw_text):
        exp_list = []
        lines = raw_text.split('\n')
        in_exp = False
        current_exp = {}
        date_pattern = r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)[a-z]*\s+\d{4}|\d{2}/\d{2,4}|\d{4})\s*(?:-|to|–)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{2}/\d{2,4}|\d{4}|Present)'

        for line in lines:
            line_strip = line.strip()
            if re.match(r'^(experience|work experience|employment history)', line_strip, re.I):
                in_exp = True
                continue
            if in_exp and re.match(r'^(education|projects|skills|certifications|achievements|summary|profile)', line_strip, re.I):
                in_exp = False
                break
            if in_exp and line_strip:
                # Find if line has a date
                date_match = re.search(date_pattern, line_strip, re.I)
                
                is_bullet = line_strip.startswith('-') or line_strip.startswith('•')
                
                # We start a new experience if we see a date AND we already have a date or responsibilities
                # Or if we see a non-bullet line and we already have responsibilities
                new_block_by_date = date_match and (current_exp.get("duration") or current_exp.get("responsibilities"))
                new_block_by_text = not is_bullet and current_exp.get("responsibilities")
                
                if new_block_by_date or new_block_by_text:
                    if current_exp.get("company") or current_exp.get("role"):
                        exp_list.append(current_exp)
                        current_exp = {"responsibilities": []}
                    else:
                        if "responsibilities" not in current_exp:
                            current_exp["responsibilities"] = []
                    
                if date_match:
                    current_exp["duration"] = date_match.group(0)
                        
                    # Split line to find company and role
                    clean_line = re.sub(date_pattern, '', line_strip, flags=re.I).strip(' |—-,')
                    if clean_line:
                        parts = re.split(r'\||—', clean_line)
                        if len(parts) > 1:
                            current_exp["role"] = parts[0].strip()
                            current_exp["company"] = parts[1].strip()
                        else:
                            if not current_exp.get("role"):
                                current_exp["role"] = parts[0].strip()
                            elif not current_exp.get("company"):
                                current_exp["company"] = parts[0].strip()

                elif not is_bullet:
                    parts = re.split(r'\||—', line_strip)
                    if len(parts) > 1:
                        if not current_exp.get("role"): current_exp["role"] = parts[0].strip()
                        if not current_exp.get("company"): current_exp["company"] = parts[1].strip()
                    else:
                        if not current_exp.get("role"):
                            current_exp["role"] = line_strip
                        elif not current_exp.get("company"):
                            current_exp["company"] = line_strip
                else:
                    if "responsibilities" not in current_exp:
                        current_exp["responsibilities"] = []
                    current_exp["responsibilities"].append(line_strip.lstrip('-• '))

        if current_exp.get("company") or current_exp.get("role"):
            exp_list.append(current_exp)
        return exp_list

    @classmethod
    def _extract_projects(cls, raw_text):
        proj_list = []
        lines = raw_text.split('\n')
        in_proj = False
        current_proj = {}
        for line in lines:
            line_strip = line.strip()
            if re.match(r'^(projects|personal projects|academic projects|key projects|selected projects|major projects)', line_strip, re.I):
                in_proj = True
                continue
            if in_proj and re.match(r'^(education|experience|skills|certifications|achievements|summary|profile)', line_strip, re.I):
                in_proj = False
                break
            if in_proj and line_strip:
                is_bullet = line_strip.startswith('-') or line_strip.startswith('•')
                
                # If it's a short line without bullet, it's likely a project name
                # If it's long, it's probably a description paragraph
                is_long_text = len(line_strip) > 40
                
                if not is_bullet and not is_long_text:
                    if current_proj.get("name"):
                        cls._populate_project_technologies(current_proj)
                        proj_list.append(current_proj)
                    
                    current_proj = {"name": "", "description": "", "technologies": [], "live_link": ""}
                    
                    parts = re.split(r'\||—', line_strip)
                    current_proj["name"] = parts[0].strip()
                    if len(parts) > 1:
                        current_proj["description"] += parts[1].strip() + " "
                elif current_proj:
                    current_proj["description"] += line_strip.lstrip('-• ') + " "
                    
                # Look for URLs
                if current_proj:
                    urls = re.findall(r'https?://[^\s]+', line_strip)
                    for url in urls:
                        if "github.com" not in url.lower() and not current_proj.get("live_link"):
                            current_proj["live_link"] = url

        if current_proj.get("name"):
            cls._populate_project_technologies(current_proj)
            proj_list.append(current_proj)
        return proj_list

    @classmethod
    def _populate_project_technologies(cls, project):
        """Deterministically identify technologies from project description/name."""
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
            if re.match(f'^({header_regex})$', line_strip, re.I):
                in_section = True
                continue
            if in_section and re.match(r'^(education|experience|skills|projects|achievements|certifications|summary|profile)', line_strip, re.I):
                in_section = False
                break
            if in_section and line_strip:
                results.append(line_strip.lstrip('-• '))
        return results

    @classmethod
    def _extract_summary(cls, raw_text):
        lines = raw_text.split('\n')
        summary = ""
        in_summary = False
        first_paragraph = ""
        
        # We will track if we've seen any standard header
        standard_headers = r'^(education|experience|skills|projects|achievements|certifications|summary|profile|objective|career objective|about me)$'
        seen_header = False

        for line in lines:
            line_strip = line.strip()
            
            # Identify first paragraph text before any headers for fallback
            if not seen_header and line_strip and not re.search(r'@[a-zA-Z0-9]', line_strip) and not re.search(r'\d{10}', line_strip) and len(line_strip) > 20:
                if not re.match(standard_headers, line_strip, re.I):
                    first_paragraph += line_strip + " "

            if re.match(r'^(summary|professional summary|profile|objective|career objective|about me)$', line_strip, re.I):
                in_summary = True
                seen_header = True
                continue
                
            if re.match(standard_headers, line_strip, re.I):
                seen_header = True
                if in_summary:
                    in_summary = False
                    break
                
            if in_summary and line_strip:
                summary += line_strip + " "
                
        if summary.strip():
            return summary.strip()
            
        # Fallback to first non-contact paragraph
        if first_paragraph.strip():
            # Only use fallback if it's less than 500 chars (heuristic to avoid matching whole resume)
            if len(first_paragraph.strip()) < 500:
                return first_paragraph.strip()
                
        return ""

    @classmethod
    def _validate_resume(cls, contact, skills, education, experience, projects, summary):
        score = 0
        if contact.get('email') or contact.get('phone'):
            score += 15
        
        # Give points for having actual keys inside skills dict
        if any(skills.values()):
            score += 25
            
        if education:
            score += 20
        if experience:
            score += 20
        if projects:
            score += 15
        if summary:
            score += 5
            
        # Hard requirement: must have contact and skills, and at least some background (edu or exp or proj)
        has_contact = bool(contact.get('email') or contact.get('phone'))
        has_skills = any(skills.values())
        has_background = bool(education or experience or projects)
        
        is_valid = has_contact and has_skills and has_background and score >= 50
        
        if not has_contact:
            reason = "No contact information found."
        elif not has_skills:
            reason = "No canonical skills identified."
        elif not has_background:
            reason = "No professional, project, or educational background found."
        elif score < 50:
            reason = f"Insufficient resume content (score: {score})."
        else:
            reason = "Valid resume structure detected."
            
        return {
            "score": score,
            "is_valid": is_valid,
            "reason": reason
        }
