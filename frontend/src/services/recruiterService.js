import { MOCK_COMPANIES } from '../mock/companies'
import { MOCK_APPLICATIONS } from '../mock/applications'

export const recruiterService = {
  getCompany: async (companyId = 1) => {
    const comp = MOCK_COMPANIES.find((c) => c.id === Number(companyId))
    if (!comp) throw new Error('Company not found')
    return comp
  },

  updateCompany: async (companyId, data) => {
    const comp = await recruiterService.getCompany(companyId)
    Object.assign(comp, data)
    return comp
  },

  getApplicantsForJob: async (jobId) => {
    return MOCK_APPLICATIONS.filter((a) => a.job_id === Number(jobId)).sort(
      (a, b) => (b.ai_analysis?.overall_match_score || 0) - (a.ai_analysis?.overall_match_score || 0)
    )
  },
}
