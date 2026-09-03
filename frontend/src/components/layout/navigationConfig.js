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
  Award,
  BarChart3,
  Layers,
  ShieldAlert,
} from 'lucide-react'

export const NAVIGATION_CONFIG = {
  CANDIDATE: [
    { label: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/candidate/profile', icon: User },
    { label: 'Resume & Skills', path: '/candidate/resume', icon: FileText },
    { label: 'Browse Jobs', path: '/jobs', icon: Briefcase },
    { label: 'My Applications', path: '/candidate/applications', icon: FileSearch },
    { label: 'Interviews', path: '/candidate/interviews', icon: Calendar },
    { label: 'Notifications', path: '/candidate/notifications', icon: Bell },
    { label: 'Settings', path: '/candidate/settings', icon: Settings },
  ],

  RECRUITER: [
    { label: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { label: 'Company Profile', path: '/recruiter/company', icon: Building },
    { label: 'Job Postings', path: '/recruiter/jobs', icon: Briefcase },
    { label: 'Interview Schedule', path: '/recruiter/interviews', icon: Calendar },
    { label: 'Notifications', path: '/recruiter/notifications', icon: Bell },
    { label: 'Settings', path: '/recruiter/settings', icon: Settings },
  ],

  ADMIN: [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Companies', path: '/admin/companies', icon: Building },
    { label: 'Job Moderation', path: '/admin/jobs', icon: Briefcase },
    { label: 'Applications Audit', path: '/admin/applications', icon: Layers },
    { label: 'Platform Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'System Settings', path: '/admin/settings', icon: ShieldAlert },
  ],
}
