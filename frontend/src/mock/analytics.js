/**
 * Mock platform analytics data for Admin dashboard and reports.
 * Explicitly structures sample platform volume and distribution metrics.
 */
export const MOCK_ANALYTICS = {
  is_demo_data: true,
  platform_overview: {
    total_users: 142,
    total_candidates: 118,
    total_recruiters: 21,
    total_companies: 16,
    total_jobs: 38,
    open_jobs: 27,
    total_applications: 312,
    total_interviews: 47,
    average_match_score: 78.4,
    ai_evaluations_completed: 312,
  },

  applications_by_status: [
    { status: 'APPLIED', label: 'Applied', count: 98, pct: 31.4 },
    { status: 'REVIEWING', label: 'Under Review', count: 84, pct: 26.9 },
    { status: 'SHORTLISTED', label: 'Shortlisted', count: 62, pct: 19.9 },
    { status: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', count: 32, pct: 10.3 },
    { status: 'HIRED', label: 'Hired', count: 14, pct: 4.5 },
    { status: 'REJECTED', label: 'Not Selected', count: 22, pct: 7.0 },
  ],

  top_demanded_skills: [
    { name: 'Python', count: 28, category: 'Backend' },
    { name: 'React', count: 24, category: 'Frontend' },
    { name: 'PostgreSQL', count: 22, category: 'Database' },
    { name: 'Docker', count: 20, category: 'DevOps' },
    { name: 'Sentence Transformers', count: 14, category: 'AI/ML' },
    { name: 'Kubernetes', count: 12, category: 'DevOps' },
    { name: 'TypeScript', count: 11, category: 'Frontend' },
    { name: 'Django', count: 10, category: 'Backend' },
  ],

  hiring_funnel: [
    { stage: 'Applications Submitted', count: 312, conversion: '100%' },
    { stage: 'Screened / Reviewing', count: 214, conversion: '68.5%' },
    { stage: 'AI Match > 75% Shortlisted', count: 94, conversion: '30.1%' },
    { stage: 'Interviews Conducted', count: 47, conversion: '15.0%' },
    { stage: 'Offers Accepted / Hired', count: 14, conversion: '4.5%' },
  ],

  monthly_growth: [
    { month: 'Apr 2026', applications: 42, jobs: 8, users: 18 },
    { month: 'May 2026', applications: 76, jobs: 12, users: 34 },
    { month: 'Jun 2026', applications: 110, jobs: 19, users: 58 },
    { month: 'Jul 2026', applications: 185, jobs: 26, users: 89 },
    { month: 'Aug 2026', applications: 312, jobs: 38, users: 142 },
  ],
}
