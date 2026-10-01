import { MOCK_USERS } from '../mock/users'
import apiClient from './api'

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

// Normalizes DRF candidate profile object and guarantees safe array/object contracts
export const normalizeProfile = (profile = {}) => {
  let flatSkills = []
  let categorizedSkills = {}

  if (profile.parsed_skills) {
    if (Array.isArray(profile.parsed_skills)) {
      flatSkills = [...new Set(profile.parsed_skills)]
      categorizedSkills = profile.categorized_skills || {}
    } else if (typeof profile.parsed_skills === 'object') {
      categorizedSkills = profile.parsed_skills
      const allSkills = []
      Object.values(profile.parsed_skills).forEach((group) => {
        if (Array.isArray(group)) {
          allSkills.push(...group)
        }
      })
      flatSkills = [...new Set(allSkills)].sort()
    }
  }

  const rawName = profile.name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.user_name || ''
  const email = profile.email || profile.user_email || ''

  return {
    ...profile,
    name: rawName || email || 'Candidate',
    email,
    parsed_skills: flatSkills,
    categorized_skills: categorizedSkills,
    parsed_education: Array.isArray(profile.parsed_education) ? profile.parsed_education : [],
    parsed_experience: Array.isArray(profile.parsed_experience) ? profile.parsed_experience : [],
    parsed_projects: Array.isArray(profile.parsed_projects) ? profile.parsed_projects : [],
    parsed_certifications: Array.isArray(profile.parsed_certifications) ? profile.parsed_certifications : [],
    parsed_achievements: Array.isArray(profile.parsed_achievements) ? profile.parsed_achievements : [],
    parsed_contact: typeof profile.parsed_contact === 'object' && profile.parsed_contact !== null ? profile.parsed_contact : {},
    parsed_summary: profile.parsed_summary || profile.bio || '',
    resume_validation: profile.resume_validation || profile.validation || null,
  }
}

export const candidateService = {
  getProfile: async () => {
    if (!isDemoMode) {
      const response = await apiClient.get('/candidate/profile/')
      return normalizeProfile(response.data)
    }

    return normalizeProfile({
      ...MOCK_USERS.candidate.profile,
      email: MOCK_USERS.candidate.email,
      name: `${MOCK_USERS.candidate.first_name} ${MOCK_USERS.candidate.last_name}`,
    })
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
    return normalizeProfile(MOCK_USERS.candidate.profile)
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
      return normalizeProfile(response.data)
    }

    // Simulates realistic resume extraction pipeline response for mock demo mode
    const extractedSkills = ['Python', 'Django', 'React', 'PostgreSQL', 'Docker', 'REST APIs', 'Git', 'Redis', 'TailwindCSS']
    const updated = {
      resume_file: file.name,
      resume_uploaded_at: new Date().toISOString(),
      parsed_skills: extractedSkills,
      parsed_education: [
        { degree: 'B.Tech in Computer Science', institution: 'State University', year: '2020 - 2024', grade: 'CGPA: 8.8 / 10' }
      ],
      parsed_experience: [
        { title: 'Software Engineering Intern', company: 'Tech Innovations Corp', duration: 'Jan 2024 - Present', description: 'Built backend microservices and React dashboards.' }
      ],
      parsed_projects: [
        { name: 'SmartATS AI Platform', description: 'Built an ATS matching engine using Django and React.', technologies: ['Django', 'React', 'PostgreSQL'] }
      ],
      parsed_certifications: ['AWS Certified Solutions Architect Associate'],
      parsed_summary: 'Passionate full stack developer with experience in modern web technologies and AI integration.',
      parsed_contact: {
        name: 'Demo Candidate',
        email: 'candidate@smartats.local',
        phone: '+1 (555) 234-5678',
        github: 'https://github.com/demo-candidate',
        linkedin: 'https://linkedin.com/in/demo-candidate'
      },
      validation: { is_valid: true, score: 90, reason: 'Valid resume structure detected.' }
    }
    MOCK_USERS.candidate.profile = { ...MOCK_USERS.candidate.profile, ...updated }
    return normalizeProfile(MOCK_USERS.candidate.profile)
  },
}

