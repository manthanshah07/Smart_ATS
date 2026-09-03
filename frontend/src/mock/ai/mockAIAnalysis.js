/**
 * Centralized Static Mock AI Analysis records.
 * Explicitly marked as prototype/sample data for UI demonstration.
 * These records represent how future Sentence Transformers (60%),
 * spaCy extraction (30%), and Experience Alignment (10%) results will be structured.
 */

export const MOCK_AI_ANALYSIS_RECORDS = {
  // Sample 1: High match candidate (e.g. Jane Doe -> Senior Full-Stack)
  sample_high_match: {
    id: 1,
    is_demo: true,
    overall_match_score: 91.5,
    semantic_similarity_score: 93.0,
    skill_match_score: 91.0,
    experience_match_score: 85.0,
    matched_skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker', 'REST APIs', 'Git'],
    missing_skills: ['Kubernetes', 'Sentence Transformers'],
    experience_match_summary: 'Candidate has 3+ years demonstrable full-stack experience aligning with the 4-year requirement.',
    explanation: {
      summary: 'Strong alignment with core backend and frontend requirements. Demonstrated experience with high-throughput REST APIs and production React architecture.',
      semantic_summary: 'High contextual vector similarity with role responsibilities.',
      strengths: ['Deep Django ORM knowledge', 'Solid React state management', 'REST API design experience'],
      recommendations: ['Explore familiarity with Kubernetes and distributed caching during interview.'],
    },
    model_name: 'all-MiniLM-L6-v2 (Demo Reference)',
    evaluated_at: '2026-08-25T14:20:00Z',
  },

  // Sample 2: Moderate match candidate
  sample_moderate_match: {
    id: 2,
    is_demo: true,
    overall_match_score: 76.0,
    semantic_similarity_score: 79.0,
    skill_match_score: 70.0,
    experience_match_score: 75.0,
    matched_skills: ['Python', 'PostgreSQL', 'Redis', 'Docker'],
    missing_skills: ['Go', 'Kubernetes', 'gRPC'],
    experience_match_summary: 'Candidate meets general distributed backend criteria but lacks Go and gRPC production experience.',
    explanation: {
      summary: 'Solid foundational Python and database competencies. Primary backend microservices in Go will require onboarding ramp-up.',
    },
    model_name: 'all-MiniLM-L6-v2 (Demo Reference)',
    evaluated_at: '2026-08-26T09:15:00Z',
  },

  // Sample 3: Frontend specialist
  sample_frontend_match: {
    id: 3,
    is_demo: true,
    overall_match_score: 84.0,
    semantic_similarity_score: 86.0,
    skill_match_score: 80.0,
    experience_match_score: 85.0,
    matched_skills: ['React', 'JavaScript', 'TailwindCSS', 'TanStack Query', 'REST APIs'],
    missing_skills: ['TypeScript', 'WebSocket'],
    experience_match_summary: 'Strong React frontend foundations with demonstrated UI/UX component design.',
    explanation: {
      summary: 'Solid frontend expertise. Recommend verifying WebSocket and high-frequency real-time rendering experience in subsequent rounds.',
    },
    model_name: 'all-MiniLM-L6-v2 (Demo Reference)',
    evaluated_at: '2026-08-24T18:00:00Z',
  },

  // Sample 4: Staff-level match
  sample_staff_match: {
    id: 4,
    is_demo: true,
    overall_match_score: 94.0,
    semantic_similarity_score: 95.0,
    skill_match_score: 94.0,
    experience_match_score: 90.0,
    matched_skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker', 'Kubernetes', 'CI/CD'],
    missing_skills: ['Sentence Transformers'],
    experience_match_summary: '6+ years in Python systems and cloud microservices.',
    explanation: {
      summary: 'Top tier candidate with extensive distributed Django and Kubernetes experience.',
    },
    model_name: 'all-MiniLM-L6-v2 (Demo Reference)',
    evaluated_at: '2026-08-26T11:00:00Z',
  },

  // Sample 5: Junior / partial fit
  sample_partial_match: {
    id: 5,
    is_demo: true,
    overall_match_score: 68.5,
    semantic_similarity_score: 72.0,
    skill_match_score: 63.0,
    experience_match_score: 65.0,
    matched_skills: ['React', 'JavaScript', 'REST APIs', 'Git'],
    missing_skills: ['Django', 'PostgreSQL', 'Docker'],
    experience_match_summary: '2 years frontend engineering with emerging Python coursework.',
    explanation: {
      summary: 'Strong frontend capabilities but limited backend Django/PostgreSQL architecture experience.',
    },
    model_name: 'all-MiniLM-L6-v2 (Demo Reference)',
    evaluated_at: '2026-08-27T16:30:00Z',
  },

  // Sample 6: Low match
  sample_low_match: {
    id: 6,
    is_demo: true,
    overall_match_score: 48.0,
    semantic_similarity_score: 52.0,
    skill_match_score: 42.0,
    experience_match_score: 40.0,
    matched_skills: ['JavaScript', 'HTML/CSS', 'Git'],
    missing_skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'REST APIs'],
    experience_match_summary: 'Entry-level experience does not meet senior requirement threshold.',
    explanation: {
      summary: 'Significant gaps in backend Python engineering and relational database design.',
    },
    model_name: 'all-MiniLM-L6-v2 (Demo Reference)',
    evaluated_at: '2026-08-21T08:00:00Z',
  },
}
