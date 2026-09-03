import { MOCK_JOBS } from '../mock/jobs'

export const jobService = {
  getJobs: async (filters = {}) => {
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
    const job = MOCK_JOBS.find((j) => j.id === Number(id))
    if (!job) throw new Error(`Job #${id} not found`)
    return job
  },

  createJob: async (jobData) => {
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
    const index = MOCK_JOBS.findIndex((j) => j.id === Number(id))
    if (index === -1) throw new Error(`Job #${id} not found`)
    MOCK_JOBS[index] = { ...MOCK_JOBS[index], ...updateData, updated_at: new Date().toISOString() }
    return MOCK_JOBS[index]
  },

  closeJob: async (id) => {
    return jobService.updateJob(id, { status: 'CLOSED' })
  },
}
