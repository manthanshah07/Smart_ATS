import { MOCK_INTERVIEWS } from '../mock/interviews'

export const interviewService = {
  getInterviews: async (filters = {}) => {
    let list = [...MOCK_INTERVIEWS]
    if (filters.candidate_id) {
      list = list.filter((i) => i.candidate_id === Number(filters.candidate_id))
    }
    if (filters.status && filters.status !== 'ALL') {
      list = list.filter((i) => i.status === filters.status)
    }
    return list
  },

  scheduleInterview: async (interviewData) => {
    const newInterview = {
      id: MOCK_INTERVIEWS.length + 1,
      ...interviewData,
      status: 'SCHEDULED',
      created_at: new Date().toISOString(),
    }
    MOCK_INTERVIEWS.unshift(newInterview)
    return newInterview
  },
}
