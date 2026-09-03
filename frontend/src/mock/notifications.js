/**
 * Mock notifications data for candidate, recruiter, and admin personas.
 */
export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    user_id: 101, // Candidate Jane Doe
    user_role: 'CANDIDATE',
    title: 'Technical Interview Scheduled',
    message: 'TechPulse AI has scheduled your Technical Assessment for Senior Full-Stack Python & React Engineer on Sep 10, 2026 at 3:00 PM UTC.',
    notification_type: 'INTERVIEW_SCHEDULED',
    link_url: '/candidate/interviews',
    is_read: false,
    created_at: '2026-08-29T10:00:00Z',
  },
  {
    id: 2,
    user_id: 101,
    user_role: 'CANDIDATE',
    title: 'Application Shortlisted',
    message: 'Your application for Lead Frontend React Developer at Apex Fintech Solutions has been moved to Shortlisted (Match Score: 84%).',
    notification_type: 'APPLICATION_STATUS',
    link_url: '/candidate/applications/103',
    is_read: false,
    created_at: '2026-08-28T14:10:00Z',
  },
  {
    id: 3,
    user_id: 101,
    user_role: 'CANDIDATE',
    title: 'AI Resume Evaluation Complete',
    message: 'Your resume has been processed. 11 skills, 1 degree, and 2 experience entries were successfully extracted.',
    notification_type: 'SYSTEM',
    link_url: '/candidate/resume',
    is_read: true,
    created_at: '2026-08-28T14:31:00Z',
  },
  {
    id: 4,
    user_id: 201, // Recruiter Alex Vance
    user_role: 'RECRUITER',
    title: 'New High-Match Applicant Received',
    message: 'Jane Doe applied for Senior Full-Stack Python & React Engineer with an Explainable AI Match Score of 91.5%.',
    notification_type: 'NEW_APPLICATION',
    link_url: '/recruiter/applications/101',
    is_read: false,
    created_at: '2026-08-25T14:20:00Z',
  },
  {
    id: 5,
    user_id: 201,
    user_role: 'RECRUITER',
    title: 'New Applicant in Queue',
    message: 'Marcus Chen submitted an application for Senior Full-Stack Python & React Engineer (Match Score: 94.0%).',
    notification_type: 'NEW_APPLICATION',
    link_url: '/recruiter/applications/104',
    is_read: true,
    created_at: '2026-08-26T11:00:00Z',
  },
  {
    id: 6,
    user_id: 301, // Admin Sarah Connor
    user_role: 'ADMIN',
    title: 'Company Verification Request',
    message: 'Horizon Health Dynamics submitted credentials for official platform verification.',
    notification_type: 'SYSTEM',
    link_url: '/admin/companies',
    is_read: false,
    created_at: '2026-08-22T12:00:00Z',
  },
]
