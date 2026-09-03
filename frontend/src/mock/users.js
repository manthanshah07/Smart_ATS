/**
 * Mock user personas: Candidate, Recruiter, Admin, plus applicant candidates for recruiter ranking demo.
 */
export const MOCK_USERS = {
  candidate: {
    id: 101,
    email: 'jane.doe@example.com',
    first_name: 'Jane',
    last_name: 'Doe',
    role: 'CANDIDATE',
    is_active: true,
    created_at: '2025-05-10T12:00:00Z',
    profile: {
      id: 501,
      phone: '+1 (555) 234-5678',
      headline: 'Senior Full-Stack Python & React Engineer',
      bio: '5+ years building scalable distributed architectures with Django, PostgreSQL, React, and AWS. Passionate about explainable AI systems.',
      location: 'San Francisco, CA',
      resume_file: 'Jane_Doe_Resume_2026.pdf',
      raw_resume_text: 'Experienced Software Engineer with proficiency in Python, Django, React, PostgreSQL, Docker, Redis, REST APIs, and Cloud Architectures...',
      parsed_skills: [
        'Python',
        'Django',
        'React',
        'JavaScript',
        'PostgreSQL',
        'Docker',
        'REST APIs',
        'Git',
        'Redis',
        'TailwindCSS',
        'CI/CD',
      ],
      parsed_education: [
        {
          degree: 'B.S. in Computer Science',
          institution: 'University of California, Berkeley',
          year: '2019 - 2023',
          grade: '3.8 GPA',
        },
      ],
      parsed_experience: [
        {
          title: 'Full-Stack Developer',
          company: 'Nexus Software Labs',
          duration: '2023 - Present (2+ yrs)',
          description: 'Designed high-throughput REST APIs and React dashboards handling 50k+ daily queries.',
        },
        {
          title: 'Software Engineering Intern',
          company: 'CloudMatrix',
          duration: 'Summer 2022 (3 mos)',
          description: 'Optimized PostgreSQL queries, improving query latency by 35%.',
        },
      ],
      resume_uploaded_at: '2026-08-28T14:30:00Z',
    },
  },

  recruiter: {
    id: 201,
    email: 'alex.recruiter@techpulse.io',
    first_name: 'Alex',
    last_name: 'Vance',
    role: 'RECRUITER',
    is_active: true,
    created_at: '2025-02-15T08:00:00Z',
    profile: {
      id: 601,
      company_id: 1,
      company_name: 'TechPulse AI',
      designation: 'Senior Technical Talent Partner',
      is_approved: true,
    },
  },

  admin: {
    id: 301,
    email: 'admin@smartats.io',
    first_name: 'Sarah',
    last_name: 'Connor',
    role: 'ADMIN',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    profile: {
      designation: 'Platform Super Administrator',
    },
  },
}

export const MOCK_ALL_USERS = [
  MOCK_USERS.candidate,
  MOCK_USERS.recruiter,
  MOCK_USERS.admin,
  {
    id: 102,
    email: 'marcus.chen@gmail.com',
    first_name: 'Marcus',
    last_name: 'Chen',
    role: 'CANDIDATE',
    is_active: true,
    created_at: '2025-06-01T10:00:00Z',
  },
  {
    id: 103,
    email: 'emily.watson@tech.org',
    first_name: 'Emily',
    last_name: 'Watson',
    role: 'CANDIDATE',
    is_active: true,
    created_at: '2025-06-15T15:00:00Z',
  },
  {
    id: 104,
    email: 'david.kim@example.com',
    first_name: 'David',
    last_name: 'Kim',
    role: 'CANDIDATE',
    is_active: false,
    created_at: '2025-07-01T09:00:00Z',
  },
  {
    id: 202,
    email: 'rachel.recruiter@acmecloud.com',
    first_name: 'Rachel',
    last_name: 'Green',
    role: 'RECRUITER',
    is_active: true,
    created_at: '2025-03-20T11:00:00Z',
  },
]
