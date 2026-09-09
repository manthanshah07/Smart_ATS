import { MOCK_APPLICATIONS } from '../mock/applications'
import { MOCK_JOBS } from '../mock/jobs'

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

  /**
   * Submit a new application for a given job.
   * Looks up the actual job to populate job_title, company_name etc.
   * Creates with pending AI state (no fake calculation).
   */
  submitApplication: async (jobId) => {
    const job = MOCK_JOBS.find((j) => j.id === Number(jobId))
    const now = new Date().toISOString()
    const newApp = {
      id: Date.now(), // Use timestamp as unique id
      job_id: Number(jobId),
      job_title: job?.title || 'Unknown Position',
      company_name: job?.company_name || 'Unknown Company',
      company_location: job?.location || '',
      candidate_id: 101,
      candidate_name: 'Jane Doe',
      candidate_email: 'jane.doe@example.com',
      candidate_headline: 'Senior Full-Stack Python & React Engineer',
      candidate_location: 'San Francisco, CA',
      candidate_experience_years: 3.5,
      status: 'APPLIED',
      applied_at: now,
      updated_at: now,
      match_score: null, // Pending AI evaluation
      resume_snapshot: {
        headline: 'Senior Full-Stack Python & React Engineer',
        skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker', 'REST APIs', 'Git', 'Redis'],
        education: [{ degree: 'B.S. Computer Science', institution: 'UC Berkeley', year: '2019–2023' }],
        experience: [
          { title: 'Full-Stack Developer', company: 'Nexus Software Labs', duration: '2023–Present', description: 'Designed high-throughput REST APIs and React dashboards.' },
        ],
      },
      timeline: [
        { step: 'APPLIED', title: 'Application Submitted', date: now, done: true },
      ],
      ai_analysis: null, // AI evaluation queued — pending backend processing
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
    const statusLabels = {
      REVIEWING: 'Under Recruiter Review',
      SHORTLISTED: 'Candidate Shortlisted',
      INTERVIEW_SCHEDULED: 'Interview Scheduled',
      REJECTED: 'Application Not Selected',
      HIRED: 'Offer Extended & Accepted',
      WITHDRAWN: 'Application Withdrawn',
    }
    app.timeline.push({
      step: newStatus,
      title: statusLabels[newStatus] || newStatus.replace(/_/g, ' '),
      date: new Date().toISOString(),
      done: true,
    })
    return app
  },

  /**
   * Candidate withdraws their own application.
   * Only valid when status is APPLIED or REVIEWING.
   */
  withdrawApplication: async (id) => {
    return applicationService.updateStatus(id, 'WITHDRAWN')
  },
}
