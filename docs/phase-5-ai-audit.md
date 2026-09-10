# SmartATS Phase 5 AI Engine Audit & Implementation Plan

## 1. Current AI Implementation
The `apps/ai_engine/` directory currently consists only of scaffolding stubs that raise `NotImplementedError`. 
- `constants.py` accurately defines the locked 60/30/10 scoring weights and 5MB file limits.
- No AI-specific dependencies (e.g., spaCy, sentence-transformers, PyMuPDF) are installed in the Python environment.

## 2. Existing Models
- **AIAnalysis**: Perfectly scoped. It includes dedicated float fields for semantic, skill, and experience scores, overall score, and JSON payloads for missing/matched skills and an explanation block.
- **Candidate**: Properly provisioned with `raw_resume_text`, `parsed_skills`, `parsed_education`, and `parsed_experience`.
- **Job**: Tracks `required_skills` and `preferred_skills` natively via JSON fields.

## 3. Existing Dependencies
The current `requirements.txt` relies strictly on core Django/DRF libraries and PostgreSQL drivers. There is no AI tooling present.

## 4. Missing Components
- Text Extraction: `PyMuPDF` (PDF), `python-docx` (DOCX).
- NLP Parsing: `spaCy` with `en_core_web_sm`.
- Embeddings: `sentence-transformers`.
- Math/Similarity: `scikit-learn`.

## 5. Proposed Architecture
1. **Resume Upload Pipeline**: Candidate uploads file -> `ResumeParser` extracts text -> `NLPExtractor` pulls skills/education/experience using spaCy -> Updates `Candidate` model.
2. **Application Pipeline**: Candidate applies for job -> `EmbeddingService` generates vectors for Candidate text and Job description -> `ExplainableMatcher` runs Cosine Similarity + Skill Intersection + Experience Heuristic -> Persists to `AIAnalysis` model.

## 6. Data-model Changes
None required. The existing DB schema for `AIAnalysis`, `Job`, and `Candidate` natively maps to the exact AI engine requirements.

## 7. Extraction Approach
- **PDF**: Leverage `PyMuPDF` (`fitz`) for robust cross-column and whitespace extraction.
- **DOCX**: Leverage `python-docx` for paragraph text aggregation.
- The extractor will catch corrupt files gracefully and return an empty string to avoid server crashes.

## 8. Parsing Approach
- Use `spaCy` to run basic NER (Named Entity Recognition).
- Create a lightweight custom Entity Ruler for tech skills (Python, Django, React, etc.).
- Use RegEx heuristics for experience duration (e.g., matching "(\d+) years" in proximity to job titles).
- If extraction confidence is low, fallbacks apply without hallucinating data.

## 9. Skill-matching Approach
- Normalize all skills (lowercase, strip whitespace).
- `Matched` = Intersection of `job.required_skills` and `candidate.parsed_skills`.
- `Missing` = `job.required_skills` - `candidate.parsed_skills`.
- `Skill Match Score` = `(len(Matched) / max(1, len(Required))) * 100`

## 10. Embedding Model Choice
`sentence-transformers/all-MiniLM-L6-v2`
- Highly performant on CPU (sub-100ms inference).
- Small footprint (~90MB).
- Strict adherence to the deterministic local-processing constraint (no external LLM APIs).

## 11. Similarity Calculation
- Use `sklearn.metrics.pairwise.cosine_similarity` between the 384-dimensional Candidate Vector and Job Vector.
- Normalize cosine values (typically -1 to 1) linearly to `0 - 100`.

## 12. Experience Calculation
- Target Base Score: `(Candidate Experience / Required Experience) * 100`
- Capped at 100.
- If required is 0, defaults immediately to 100.

## 13. Final Scoring Formula
**LOCKED:** `(Semantic Score * 0.60) + (Skill Score * 0.30) + (Experience Score * 0.10)`

## 14. Explainability Structure
The generated `AIAnalysis` payload will populate `explanation` with JSON describing strengths (matched skills) and gaps (missing skills). The front-end recruiter dashboard natively consumes these nested objects.

## 15. API Contract
- `POST /api/v1/candidate/resume/`: Triggers synchronously. Response latency ~1.5s on CPU.
- `POST /api/v1/applications/`: Triggers embedding and scoring synchronously. Returns the completed `AIAnalysis` within the `201 Created` response. Synchronous processing is acceptable given `all-MiniLM` speed constraints (~3 seconds total).

## 16. Performance Strategy
**Critical:** `SentenceTransformer` will be initialized as a Singleton at server startup (e.g., inside `apps.py` `ready()` function) to prevent catastrophic memory swapping and 10s+ latency penalties from re-loading weights into memory per request.

## 17. Testing Strategy
- Pass mocked raw text payloads into `ExplainableMatcher` directly to assert exact 60/30/10 math outputs.
- Test `NLPExtractor` with capitalization variances (e.g., "react.js" vs "React").
- Enforce strict authorization isolation ensuring recruiters cannot view `AIAnalysis` IDs associated with unauthorized companies.

## 18. Risks/Limitations
- Deterministic NLP (spaCy + regex) for experience parsing is notoriously fragile across varying resume layouts compared to modern LLMs. False negatives in experience calculation are likely.
- CPU saturation during concurrent multipart-form resume uploads. A background queue (Celery) may be needed later if user concurrency scales.

## 19. Implementation Order
1. Install Python ML dependencies.
2. Build `ResumeParser` (File -> Text).
3. Build `NLPExtractor` (Text -> JSON Skills/Exp).
4. Build `EmbeddingService` Singleton.
5. Build `ExplainableMatcher` (Math).
6. Connect hooks into `CandidateResumeUploadView` and `ApplicationSubmitView`.
