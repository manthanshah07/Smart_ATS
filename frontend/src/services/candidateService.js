import { MOCK_USERS } from '../mock/users'

export const candidateService = {
  getProfile: async () => {
    return { ...MOCK_USERS.candidate.profile, email: MOCK_USERS.candidate.email, name: `${MOCK_USERS.candidate.first_name} ${MOCK_USERS.candidate.last_name}` }
  },

  updateProfile: async (profileData) => {
    MOCK_USERS.candidate.profile = {
      ...MOCK_USERS.candidate.profile,
      ...profileData,
    }
    return MOCK_USERS.candidate.profile
  },

  uploadResume: async (file) => {
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
