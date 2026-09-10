import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from .constants import (
    WEIGHT_SEMANTIC_SIMILARITY,
    WEIGHT_SKILL_MATCH,
    WEIGHT_EXPERIENCE_ALIGNMENT
)
from .embeddings import EmbeddingService

class ExplainableMatcher:
    """Computes cosine similarity, skill overlap, experience alignment, and generates explainability breakdown."""

    @classmethod
    def calculate_match(cls, candidate, job):
        """
        Calculates composite match:
        - Semantic similarity (60%)
        - Skill match (30%)
        - Experience alignment (10%)
        
        Returns a dictionary representing the AIAnalysis fields.
        """
        # 1. Semantic Similarity
        resume_text = candidate.raw_resume_text or ""
        job_text = f"{job.title}\n{job.description}"
        
        cand_emb = EmbeddingService.get_embedding(resume_text)
        job_emb = EmbeddingService.get_embedding(job_text)
        
        # Scikit-learn expects 2D arrays
        cand_emb_2d = np.array(cand_emb).reshape(1, -1)
        job_emb_2d = np.array(job_emb).reshape(1, -1)
        
        # cosine_similarity returns a 2D array, we want the scalar [0][0]
        cos_sim = cosine_similarity(cand_emb_2d, job_emb_2d)[0][0]
        # Normalize from [-1, 1] to [0, 100]
        semantic_score = max(0.0, float(cos_sim) * 100.0)

        # 2. Skill Match
        required_skills = set(job.required_skills)
        
        parsed_skills = set()
        if isinstance(candidate.parsed_skills, dict):
            for category, skills in candidate.parsed_skills.items():
                parsed_skills.update(skills)
        elif isinstance(candidate.parsed_skills, list):
            parsed_skills.update(candidate.parsed_skills)
        
        matched_skills = list(required_skills.intersection(parsed_skills))
        missing_skills = list(required_skills.difference(parsed_skills))
        
        if len(required_skills) == 0:
            skill_score = 100.0
        else:
            skill_score = (len(matched_skills) / len(required_skills)) * 100.0

        # 3. Experience Alignment
        req_exp = job.experience_min_years
        
        cand_exp_years = 0.0
        if candidate.parsed_experience:
            try:
                years = []
                for exp in candidate.parsed_experience:
                    if isinstance(exp, str):
                        # Backwards compatibility for ["3 years"]
                        val = float(exp.split()[0].replace('+', ''))
                        years.append(val)
                    elif isinstance(exp, dict) and exp.get('duration'):
                        # Very basic fallback for old math heuristic
                        # In a real system, you'd calculate exact date diffs
                        dur_str = exp['duration']
                        match = re.search(r'(\d+(?:\.\d+)?)\+?\s*years?', dur_str, re.I)
                        if match:
                            years.append(float(match.group(1)))
                        else:
                            # Try to extract the date diff heuristically
                            years.append(0.0) 
                
                if years:
                    cand_exp_years = max(years)
            except Exception:
                cand_exp_years = 0.0
                
        if req_exp == 0:
            exp_score = 100.0
            exp_summary = "Candidate meets the flexible experience requirements."
        else:
            exp_score = (cand_exp_years / req_exp) * 100.0
            exp_score = min(100.0, exp_score)
            if cand_exp_years >= req_exp:
                exp_summary = f"Candidate has {cand_exp_years} years, meeting or exceeding required {req_exp} years."
            else:
                exp_summary = f"Candidate has {cand_exp_years} years, falling short of required {req_exp} years."

        # 4. Final Score
        final_score = (
            (semantic_score * WEIGHT_SEMANTIC_SIMILARITY) +
            (skill_score * WEIGHT_SKILL_MATCH) +
            (exp_score * WEIGHT_EXPERIENCE_ALIGNMENT)
        )
        
        explanation = {
            "summary": "AI Match Analysis complete.",
            "semantic_summary": f"Vector similarity is {semantic_score:.1f}%",
            "strengths": matched_skills,
            "recommendations": missing_skills
        }

        return {
            "overall_match_score": round(final_score, 1),
            "semantic_similarity_score": round(semantic_score, 1),
            "skill_match_score": round(skill_score, 1),
            "experience_match_score": round(exp_score, 1),
            "matched_skills": sorted(matched_skills),
            "missing_skills": sorted(missing_skills),
            "experience_match_summary": exp_summary,
            "explanation": explanation
        }
