# Team AI Repository Comparison

## Objective
To compare the capabilities of the current SmartATS implementation with the team's R&D repository (`Prem-Yelwande/AI_ATS`) and establish exactly which architectural concepts we will adopt.

## Comparison Matrix

| Capability | SmartATS | Team Repository | Recommended SmartATS Approach |
|---|---|---|---|
| **PDF Extraction** | PyMuPDF (`fitz`) | PyPDFLoader (LangChain) | Retain PyMuPDF. It is faster, robust, and completely local. |
| **DOCX Extraction** | `python-docx` | Docx2txtLoader (LangChain) | Retain `python-docx`. |
| **Resume Validation** | None | LLM evaluation (Prompt-driven) | Adopt validation concept but use deterministic heuristics (presence of email, phone, skills, education) instead of LLMs. |
| **Contact Extraction** | None | LLM extraction into schema | Adopt. Use RegEx + SpaCy NER to extract Name, Email, Phone, LinkedIn, GitHub, Location. |
| **Skills** | Deterministic substring vocabulary (flat list) | LLM parsing (categorized dict) | Adopt categorized dictionaries (`languages`, `frameworks`, `databases`, `cloud`, `tools`, `ai_ml`, `other`). Retain deterministic vocabulary matching. |
| **Education** | Simple RegEx (flat strings) | LLM parsing into explicit fields | Adopt structured JSON objects (degree, institution, duration, location, GPA, coursework) using advanced RegEx/NLP chunking. |
| **Experience** | Simple RegEx (years count) | LLM parsing into explicit fields | Adopt structured JSON objects (company, role, duration, location, responsibilities) by heuristically segmenting employment blocks. |
| **Projects** | None | LLM parsing into explicit fields | Adopt structured JSON objects (name, description, technologies, live_link) extracted from the `Projects` section. |
| **Technologies** | Handled under Skills | Handled explicitly inside Projects | Adopt. Embed recognized technologies into the extracted Projects. |
| **Certifications** | None | LLM parsed list | Adopt. Extract from standard sections into a simple string list. |
| **Achievements** | None | LLM parsed list | Adopt. Extract from standard sections into a simple string list. |
| **Summary** | None | LLM parsed summary | Adopt. Extract the first non-contact paragraph as Summary. |
| **AI Scoring** | 60% Semantic / 30% Skill / 10% Exp | N/A | Retain exactly as is. New fields will NOT silently alter the deterministic score. |
| **Embeddings** | HuggingFace SentenceTransformers | LLM / Vector DB embeddings | Retain SentenceTransformers. |

## Ideas Adopted
- The structured `ResumeData` concept (modularizing experience, projects, education).
- Skill categorization logic.
- Resume Validation (gating extraction quality).
- Explicit contact/profile extraction from the resume.

## Ideas Deliberately Rejected
- **LangChain / LangGraph**: Unnecessary bloat and overhead for this specific ATS use-case.
- **External LLM APIs (Gemini/Mistral/Groq)**: Violates the constraint of having a local, deterministic engine.
- **SQLModel / FastAPI**: Violates the existing Django + DRF architecture.
- **LLM-Based Resume Validation/Extraction**: Replaced entirely by local deterministic NLP and heuristic rules to preserve predictability and cost-efficiency.
