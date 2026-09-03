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
    // Prototype submission: Creates application with pending AI state (no fake calculation)
    const newApp = {
      id: MOCK_APPLICATIONS.length + 101,
      job_id: Number(jobId),
      job_title: 'Senior Full-Stack Python & React Engineer',
      company_name: 'TechPulse AI',
      company_location: 'San Francisco, CA (Hybrid)',
      candidate_id: 101,
      candidate_name: 'Jane Doe',
      candidate_email: 'jane.doe@example.com',
      status: 'APPLIED',
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resume_snapshot: {
        headline: 'Senior Full-Stack Python & React Engineer',
        skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker', 'REST APIs', 'Git', 'Redis'],
      },
      timeline: [
        { step: 'APPLIED', title: 'Application Submitted', date: 'Just now', done: true },
      ],
      ai_analysis: null, // Pending evaluation state
    }
    MOCK_APPLICATIONS.unshift(newApp)
    return newApp
  },

  updateStatus: async (id, newStatus) => {
    const app = MOCK_APPLICATIONS.find((a) => a.id === Number(id))
    if (!app) throw new Error(`Application #${id} not found`)
    app.status = newStatus
    app.updated_at = new Date().toISOString()
    app.timeline = app.timeline || []
    app.timeline.push({
      step: newStatus,
      title: `Status Updated to ${newStatus.replace('_', ' ')}`,
      date: 'Just now',
      done: true,
    })
    return app
  },
}
