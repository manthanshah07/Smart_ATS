import { MOCK_JOBS } from '../mock/jobs'
import apiClient from './api'

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

// Helper to normalize backend DRF job objects to match frontend expectations
const normalizeJob = (job) => {
  return {
    ...job,
    company_name: job.company_details?.name || 'Unknown Company',
    recruiter_name: job.recruiter_details?.user_name || 'Unknown Recruiter',
    // Fallbacks to avoid breaking UI that expects array of skills
    required_skills: Array.isArray(job.required_skills) ? job.required_skills : [],
  }
}

export const jobService = {
  getJobs: async (filters = {}) => {
    if (!isDemoMode) {
      const params = {}
      if (filters.search) params.search = filters.search
      if (filters.location && filters.location !== 'ALL') params.location = filters.location
      if (filters.job_type && filters.job_type !== 'ALL') params.job_type = filters.job_type
      // Note: Backend handles status filter natively (public users only see OPEN)
      
      const response = await apiClient.get('/jobs/', { params })
      // Unpack DRF pagination
      const results = response.data.results || response.data
      return results.map(normalizeJob)
    }

    let list = [...MOCK_JOBS]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company_name.toLowerCase().includes(q) ||
          j.required_skills.some((s) => s.toLowerCase().includes(q))
      )
    }

    if (filters.location && filters.location !== 'ALL') {
      list = list.filter((j) => j.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    if (filters.job_type && filters.job_type !== 'ALL') {
      list = list.filter((j) => j.job_type === filters.job_type)
    }

    if (filters.status && filters.status !== 'ALL') {
      list = list.filter((j) => j.status === filters.status)
    }

    if (filters.company_id) {
      list = list.filter((j) => j.company_id === Number(filters.company_id))
    }

    return list
  },

  getJobById: async (id) => {
    if (!isDemoMode) {
      const response = await apiClient.get(`/jobs/${id}/`)
      return normalizeJob(response.data)
    }

    const job = MOCK_JOBS.find((j) => j.id === Number(id))
    if (!job) throw new Error(`Job #${id} not found`)
    return job
  },

  createJob: async (jobData) => {
    if (!isDemoMode) {
      const response = await apiClient.post('/jobs/', jobData)
      return normalizeJob(response.data)
    }

    const newJob = {
      id: MOCK_JOBS.length + 1,
      ...jobData,
      company_id: 1,
      company_name: 'TechPulse AI',
      recruiter_id: 201,
      recruiter_name: 'Alex Vance',
      applicants_count: 0,
      status: jobData.status || 'OPEN',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    MOCK_JOBS.unshift(newJob)
    return newJob
  },

  updateJob: async (id, updateData) => {
    if (!isDemoMode) {
      const response = await apiClient.patch(`/jobs/${id}/`, updateData)
      return normalizeJob(response.data)
    }

    const index = MOCK_JOBS.findIndex((j) => j.id === Number(id))
    if (index === -1) throw new Error(`Job #${id} not found`)
    MOCK_JOBS[index] = { ...MOCK_JOBS[index], ...updateData, updated_at: new Date().toISOString() }
    return MOCK_JOBS[index]
  },

  closeJob: async (id) => {
    return jobService.updateJob(id, { status: 'CLOSED' })
  },
}
