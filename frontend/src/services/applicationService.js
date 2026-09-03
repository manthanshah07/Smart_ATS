import { MOCK_APPLICATIONS } from '../mock/applications'

export const applicationService = {
  getApplications: async (filters = {}) => {
    let list = [...MOCK_APPLICATIONS]
    if (filters.candidate_id) {
      list = list.filter((a) => a.candidate_id === Number(filters.candidate_id))
    }
    if (filters.job_id) {
      list = list.filter((a) => a.job_id === Number(filters.job_id))
    }
    if (filters.status && filters.status !== 'ALL') {
      list = list.filter((a) => a.status === filters.status)
    }
    return list
  },

  getApplicationById: async (id) => {
    const app = MOCK_APPLICATIONS.find((a) => a.id === Number(id))
    if (!app) throw new Error(`Application #${id} not found`)
    return app
  },

  submitApplication: async (jobId) => {
    const newApp = {
      id: MOCK_APPLICATIONS.length + 101,
      job_id: Number(jobId),
      job_title: 'Senior Full-Stack Python & React Engineer',
      company_name: 'TechPulse AI',
      candidate_id: 101,
      candidate_name: 'Jane Doe',
      candidate_email: 'jane.doe@example.com',
      status: 'APPLIED',
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      timeline: [
        { step: 'APPLIED', title: 'Application Submitted', date: 'Just now', done: true },
      ],
      ai_analysis: {
        id: 99,
        overall_match_score: 89.0,
        semantic_similarity_score: 91.0,
        skill_match_score: 87.0,
        experience_match_score: 85.0,
        matched_skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker', 'REST APIs'],
        missing_skills: ['Kubernetes'],
        experience_match_summary: 'Profile aligns with required full-stack years.',
        explanation: {
          summary: 'High semantic alignment with candidate resume snapshot.',
        },
      },
    }
    MOCK_APPLICATIONS.unshift(newApp)
    return newApp
  },

  updateStatus: async (id, newStatus) => {
    const app = MOCK_APPLICATIONS.find((a) => a.id === Number(id))
    if (!app) throw new Error(`Application #${id} not found`)
    app.status = newStatus
    app.updated_at = new Date().toISOString()
    app.timeline.push({
      step: newStatus,
      title: `Status Updated to ${newStatus}`,
      date: 'Just now',
      done: true,
    })
    return app
  },
}
