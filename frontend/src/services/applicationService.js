import { MOCK_APPLICATIONS } from '../mock/applications'
import { MOCK_JOBS } from '../mock/jobs'
import apiClient from './api'

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

// Normalizes backend DRF applications to frontend expectations
const normalizeApp = (app) => {
  return {
    ...app,
    job_title: app.job_details?.title || 'Unknown Position',
    company_name: app.job_details?.company_details?.name || 'Unknown Company',
    company_location: app.job_details?.location || '',
    candidate_name: `${app.candidate_details?.user_name || ''}`.trim() || 'Unknown Candidate',
    candidate_email: app.candidate_details?.user_email || '',
    candidate_headline: app.candidate_details?.headline || '',
    candidate_location: app.candidate_details?.location || '',
    match_score: app.ai_analysis?.overall_match_score || null,
    timeline: (app.status_history || []).map((history) => ({
      step: history.status,
      title: history.status.replace(/_/g, ' '),
      date: history.changed_at,
      done: true,
    })),
  }
}

export const applicationService = {
  getApplications: async (filters = {}) => {
    if (!isDemoMode) {
      let endpoint = '/candidate/applications/'
      if (filters.job_id) {
        endpoint = `/jobs/${filters.job_id}/applicants/`
      }
      const response = await apiClient.get(endpoint)
      const results = response.data.results || response.data
      return results.map(normalizeApp)
    }

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
    if (!isDemoMode) {
      // Assuming recruiter accesses applicants or candidate uses their own list.
      // DRF doesn't have a direct application detail view yet for general purpose, 
      // but if the frontend calls this, we must fetch from list and filter.
      // Wait! The backend doesn't have an endpoint for `GET /applications/{id}/`.
      // I'll simulate it by returning from the appropriate list.
      // However, usually it's passed down or fetched from applicant list.
      const response = await apiClient.get('/candidate/applications/')
      const results = response.data.results || response.data
      const app = results.find((a) => a.id === Number(id))
      if (app) return normalizeApp(app)
      throw new Error(`Application #${id} not found`)
    }

    const app = MOCK_APPLICATIONS.find((a) => a.id === Number(id))
    if (!app) throw new Error(`Application #${id} not found`)
    return app
  },

  submitApplication: async (jobId) => {
    if (!isDemoMode) {
      const response = await apiClient.post('/applications/', { job: jobId })
      return normalizeApp(response.data)
    }

    const job = MOCK_JOBS.find((j) => j.id === Number(jobId))
    const now = new Date().toISOString()
    const newApp = {
      id: Date.now(),
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
      match_score: null,
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
      ai_analysis: null,
    }
    MOCK_APPLICATIONS.unshift(newApp)
    return newApp
  },

  updateStatus: async (id, newStatus) => {
    if (!isDemoMode) {
      const response = await apiClient.patch(`/applications/${id}/status/`, { status: newStatus })
      return normalizeApp(response.data)
    }

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

  withdrawApplication: async (id) => {
    if (!isDemoMode) {
      const response = await apiClient.patch(`/candidate/applications/${id}/withdraw/`)
      return normalizeApp(response.data)
    }

    return applicationService.updateStatus(id, 'WITHDRAWN')
  },
}
