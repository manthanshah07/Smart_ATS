/**
 * Mock job openings across diverse domains and experience levels.
 */
export const MOCK_JOBS = [
  {
    id: 1,
    company_id: 1,
    company_name: 'TechPulse AI',
    recruiter_id: 201,
    recruiter_name: 'Alex Vance',
    title: 'Senior Full-Stack Python & React Engineer',
    department: 'Core Platform Engineering',
    location: 'San Francisco, CA (Hybrid)',
    job_type: 'FULL_TIME',
    experience_min_years: 4,
    required_skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker', 'REST APIs'],
    preferred_skills: ['Redis', 'AWS', 'Kubernetes', 'Sentence Transformers', 'CI/CD'],
    description: `### Role Overview
We are looking for an experienced Full-Stack Engineer to architect and build our next-generation applicant matching platform. You will work closely with ML engineers and product designers to deliver low-latency API services and accessible, responsive web interfaces.

### Responsibilities
- Architect, build, and maintain production-grade REST APIs in Django / DRF.
- Develop interactive, high-performance web applications in React with modern design systems.
- Integrate NLP models (spaCy, Sentence Transformers) for real-time semantic analysis.
- Write unit, integration, and security tests across the stack.

### Requirements
- 4+ years of professional full-stack development experience.
- Strong proficiency in Python, Django, React, and modern JavaScript.
- Experience with relational database design and optimization (PostgreSQL).
- Deep understanding of authentication, security best practices (JWT, RBAC), and Docker containerization.`,
    status: 'OPEN',
    applicants_count: 18,
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-20T12:00:00Z',
  },
  {
    id: 2,
    company_id: 1,
    company_name: 'TechPulse AI',
    recruiter_id: 201,
    recruiter_name: 'Alex Vance',
    title: 'Machine Learning / NLP Engineer',
    department: 'Applied AI Research',
    location: 'Remote (US/Canada)',
    job_type: 'FULL_TIME',
    experience_min_years: 3,
    required_skills: ['Python', 'PyTorch', 'HuggingFace', 'spaCy', 'Sentence Transformers', 'FastAPI'],
    preferred_skills: ['scikit-learn', 'Vector DBs', 'Docker', 'MLflow'],
    description: `### Role Overview
TechPulse AI is seeking an Applied NLP Engineer to develop explainable semantic embeddings and document parsing pipelines. You will optimize text extraction and vector similarity models for production deployment.

### Responsibilities
- Implement resume parsing, named entity recognition, and skill taxonomy extraction using spaCy.
- Fine-tune dense embedding models for domain-specific cosine similarity evaluation.
- Build explainable scoring algorithms that provide transparent feedback to candidates and recruiters.`,
    status: 'OPEN',
    applicants_count: 14,
    created_at: '2026-08-18T14:00:00Z',
    updated_at: '2026-08-22T09:00:00Z',
  },
  {
    id: 3,
    company_id: 2,
    company_name: 'Acme Cloud Systems',
    recruiter_id: 202,
    recruiter_name: 'Rachel Green',
    title: 'Senior Backend Distributed Systems Developer',
    department: 'Infrastructure',
    location: 'Austin, TX (Remote)',
    job_type: 'FULL_TIME',
    experience_min_years: 5,
    required_skills: ['Python', 'Go', 'PostgreSQL', 'Redis', 'Kubernetes', 'gRPC'],
    preferred_skills: ['Terraform', 'AWS', 'Distributed Caching'],
    description: `Design high-throughput distributed message brokers and microservices powering cloud deployment automation.`,
    status: 'OPEN',
    applicants_count: 22,
    created_at: '2026-08-10T11:00:00Z',
    updated_at: '2026-08-25T16:00:00Z',
  },
  {
    id: 4,
    company_id: 3,
    company_name: 'Apex Fintech Solutions',
    recruiter_id: 201,
    recruiter_name: 'Alex Vance',
    title: 'Lead Frontend React Developer',
    department: 'Trading UI',
    location: 'New York, NY (Hybrid)',
    job_type: 'FULL_TIME',
    experience_min_years: 4,
    required_skills: ['React', 'TypeScript', 'TailwindCSS', 'WebSocket', 'TanStack Query'],
    preferred_skills: ['shadcn/ui', 'Chart.js', 'Next.js'],
    description: `Build real-time streaming financial dashboards and interactive execution views for institutional trading desks.`,
    status: 'OPEN',
    applicants_count: 9,
    created_at: '2026-08-20T08:30:00Z',
    updated_at: '2026-08-27T10:15:00Z',
  },
  {
    id: 5,
    company_id: 1,
    company_name: 'TechPulse AI',
    recruiter_id: 201,
    recruiter_name: 'Alex Vance',
    title: 'Software Engineering Intern (Summer 2026)',
    department: 'Engineering Internships',
    location: 'San Francisco, CA (On-site)',
    job_type: 'INTERN',
    experience_min_years: 0,
    required_skills: ['Python', 'JavaScript', 'Git', 'Data Structures'],
    preferred_skills: ['React', 'Django', 'SQL'],
    description: `12-week intensive engineering internship building developer tools and learning modern SaaS deployment.`,
    status: 'PAUSED',
    applicants_count: 35,
    created_at: '2026-07-01T09:00:00Z',
    updated_at: '2026-08-01T12:00:00Z',
  },
  {
    id: 6,
    company_id: 4,
    company_name: 'Horizon Health Dynamics',
    recruiter_id: 202,
    recruiter_name: 'Rachel Green',
    title: 'DevOps & Cloud Security Specialist',
    department: 'SecOps',
    location: 'Boston, MA (Remote)',
    job_type: 'FULL_TIME',
    experience_min_years: 3,
    required_skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
    preferred_skills: ['Vault', 'SOC2 Compliance', 'Python'],
    description: `Manage HIPAA-compliant healthcare cloud infrastructure with automated CI/CD and zero-trust security postures.`,
    status: 'OPEN',
    applicants_count: 8,
    created_at: '2026-08-22T13:45:00Z',
    updated_at: '2026-08-26T15:30:00Z',
  },
]
