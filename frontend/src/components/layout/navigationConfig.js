import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  FileSearch,
  Calendar,
  Bell,
  Settings,
  Building,
  Users,
  BarChart3,
  Layers,
  ShieldCheck,
} from 'lucide-react'

export const NAVIGATION_CONFIG = {
  CANDIDATE: {
    primary: [
      { label: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
      { label: 'Explore Jobs', path: '/jobs', icon: Briefcase },
      { label: 'My Applications', path: '/candidate/applications', icon: FileSearch },
      { label: 'Resume & Skills', path: '/candidate/resume', icon: FileText },
      { label: 'Interviews', path: '/candidate/interviews', icon: Calendar },
    ],
    secondary: [
      { label: 'Candidate Profile', path: '/candidate/profile', icon: User },
      { label: 'Notifications', path: '/candidate/notifications', icon: Bell },
      { label: 'Settings', path: '/candidate/settings', icon: Settings },
    ],
  },

  RECRUITER: {
    primary: [
      { label: 'Overview', path: '/recruiter/dashboard', icon: LayoutDashboard },
      { label: 'Job Postings', path: '/recruiter/jobs', icon: Briefcase },
      { label: 'Candidate Pipeline', path: '/recruiter/applicants', icon: Users },
      { label: 'Interviews', path: '/recruiter/interviews', icon: Calendar },
    ],
    secondary: [
      { label: 'Company Profile', path: '/recruiter/company', icon: Building },
      { label: 'Notifications', path: '/recruiter/notifications', icon: Bell },
      { label: 'Settings', path: '/recruiter/settings', icon: Settings },
    ],
  },

  ADMIN: {
    primary: [
      { label: 'Platform Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'User Directory', path: '/admin/users', icon: Users },
      { label: 'Verified Companies', path: '/admin/companies', icon: Building },
      { label: 'Job Moderation', path: '/admin/jobs', icon: Briefcase },
      { label: 'Application Audit', path: '/admin/applications', icon: Layers },
      { label: 'Analytics & Funnel', path: '/admin/analytics', icon: BarChart3 },
    ],
    secondary: [
      { label: 'Notifications', path: '/admin/notifications', icon: Bell },
      { label: 'System Settings', path: '/admin/settings', icon: ShieldCheck },
    ],
  },
}
