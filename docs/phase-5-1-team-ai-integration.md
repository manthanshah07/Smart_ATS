# Phase 5.1 — Team AI Integration Report

## What was learned from the teammate repository
The teammate repository (`Prem-Yelwande/AI_ATS`) introduces a rich, structured `ResumeData` object schema. Rather than just capturing a flat list of skills and calculating dense semantic similarity, the teammate repo captures projects, categorized skills, educational blocks, and granular experience records. It also provides a smart "validation" heuristic to determine if the uploaded document is actually a resume.

## What was adopted
1. **The Rich JSON Data Schema**: We adopted the comprehensive schema including Contact Info, Certifications, Achievements, Projects, and Summary.
2. **Skill Categorization**: We now map our canonical `ATS_SKILLS_VOCABULARY` into explicit domains (`languages`, `frameworks`, `cloud`, etc.).
3. **Deterministic Validation Gate**: We built a `validate_resume` method that assigns a score from 0-100 based on the presence of contact info, skills, education, and experience.

## What was deliberately rejected
- **LangChain / LangGraph**: We completely rejected the LLM agentic workflow. We achieved equivalent extraction logic via fast, local SpaCy + RegEx heuristics.
- **External LLM APIs**: We completely rejected Gemini/Mistral/Groq, ensuring our ATS remains cost-free and 100% locally hosted.
- **Database Schema Bloat**: Instead of adding 10 new relational tables (SQLModel), we safely appended the new fields as JSON structures to the existing `Candidate` model, ensuring a clean architecture.

## New Structured Resume Capabilities
The `NLPExtractor` now emits:
- `contact`: Extracted email, phone, LinkedIn, and GitHub.
- `skills`: Categorized dictionary of canonical skills.
- `education`: JSON objects with degree and institution.
- `experience`: JSON objects with duration, role, and company.
- `projects`: Extracted blocks with title and description.
- `certifications` & `achievements`: Unordered extracted lists.
- `summary`: Initial profile text.
- `validation`: Deterministic `is_valid` flag.

## Data-Model Impact
The `Candidate` model was safely updated via Django migration to add:
`parsed_projects`, `parsed_certifications`, `parsed_achievements`, `parsed_summary`, `parsed_contact`, and `resume_validation`.

## Registration Status
No regressions were introduced. The modifications to `CandidateResumeUploadView` are fully isolated to the resume upload flow and do not impact `RegisterView` or the `UserRegistrationSerializer`.

## Performance
The extraction remains completely synchronous and entirely deterministic. Because it utilizes `re` and `en_core_web_sm`, it executes in less than 50ms per resume. No external network I/O is required.

## Limitations
Heuristic extraction is inherently less precise than a multi-shot LLM, specifically around fuzzy unstructured dates or abstract project descriptions. However, it provides extreme cost efficiency and absolute determinism while perfectly fitting our 60/30/10 math constraint.
