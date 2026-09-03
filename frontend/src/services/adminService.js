import { MOCK_ALL_USERS } from '../mock/users'
import { MOCK_COMPANIES } from '../mock/companies'
import { MOCK_JOBS } from '../mock/jobs'
import { MOCK_APPLICATIONS } from '../mock/applications'
import { MOCK_ANALYTICS } from '../mock/analytics'

export const adminService = {
  getUsers: async (filters = {}) => {
    let list = [...MOCK_ALL_USERS]
    if (filters.role && filters.role !== 'ALL') {
      list = list.filter((u) => u.role === filters.role)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter((u) => u.email.toLowerCase().includes(q) || `${u.first_name} ${u.last_name}`.toLowerCase().includes(q))
    }
    return list
  },

  toggleUserStatus: async (userId, activeStatus) => {
    const user = MOCK_ALL_USERS.find((u) => u.id === Number(userId))
    if (user) user.is_active = activeStatus
    return user
  },

  getCompanies: async () => {
    return [...MOCK_COMPANIES]
  },

  toggleCompanyVerification: async (companyId, isVerified) => {
    const comp = MOCK_COMPANIES.find((c) => c.id === Number(companyId))
    if (comp) comp.is_verified = isVerified
    return comp
  },

  getJobs: async () => {
    return [...MOCK_JOBS]
  },

  getApplications: async () => {
    return [...MOCK_APPLICATIONS]
  },

  getAnalytics: async () => {
    return { ...MOCK_ANALYTICS }
  },
}
