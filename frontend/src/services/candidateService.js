import { MOCK_USERS } from '../mock/users'
import apiClient from './api'

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

// Normalizes DRF candidate profile object
const normalizeProfile = (profile) => {
  return {
    ...profile,
    name: profile.user_name || 'Unknown Candidate',
    email: profile.user_email || '',
  }
}

export const candidateService = {
  getProfile: async () => {
    if (!isDemoMode) {
      const response = await apiClient.get('/candidate/profile/')
      return normalizeProfile(response.data)
    }

    return { ...MOCK_USERS.candidate.profile, email: MOCK_USERS.candidate.email, name: `${MOCK_USERS.candidate.first_name} ${MOCK_USERS.candidate.last_name}` }
  },

  updateProfile: async (profileData) => {
    if (!isDemoMode) {
      const response = await apiClient.patch('/candidate/profile/', profileData)
      return normalizeProfile(response.data)
    }

    MOCK_USERS.candidate.profile = {
      ...MOCK_USERS.candidate.profile,
      ...profileData,
    }
    return MOCK_USERS.candidate.profile
  },

  uploadResume: async (file) => {
    if (!isDemoMode) {
      const formData = new FormData()
      formData.append('resume', file)
      const response = await apiClient.post('/candidate/resume/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    }

    // Simulates realistic resume extraction pipeline response
    const extractedSkills = ['Python', 'Django', 'React', 'PostgreSQL', 'Docker', 'REST APIs', 'Git', 'Redis', 'TailwindCSS']
    const updated = {
      resume_file: file.name,
      resume_uploaded_at: new Date().toISOString(),
      parsed_skills: extractedSkills,
    }
    MOCK_USERS.candidate.profile = { ...MOCK_USERS.candidate.profile, ...updated }
    return updated
  },
}
