/**
 * Centralized status configuration and color tokens for SmartATS.
 * Ensures strict semantic consistency across all candidate, recruiter, and admin portals.
 */

export const APPLICATION_STATUS = {
  APPLIED: {
    label: 'Applied',
    variant: 'secondary',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    description: 'Application submitted and received by hiring team.',
  },
  REVIEWING: {
    label: 'Under Review',
    variant: 'default',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
    description: 'Application is currently being evaluated by recruiter.',
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    variant: 'success',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Candidate passed initial screening and was shortlisted.',
  },
  INTERVIEW_SCHEDULED: {
    label: 'Interview Scheduled',
    variant: 'warning',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
    description: 'Interview round has been scheduled.',
  },
  REJECTED: {
    label: 'Not Selected',
    variant: 'destructive',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
    description: 'Application will not be progressing further.',
  },
  HIRED: {
    label: 'Hired',
    variant: 'success',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800 font-semibold',
    description: 'Offer accepted and candidate officially hired.',
  },
}

export const JOB_STATUS = {
  DRAFT: {
    label: 'Draft',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
  },
  OPEN: {
    label: 'Active & Open',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
  PAUSED: {
    label: 'Paused',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300',
  },
  CLOSED: {
    label: 'Closed',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300',
  },
}

export const INTERVIEW_STATUS = {
  SCHEDULED: {
    label: 'Scheduled',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300',
  },
  COMPLETED: {
    label: 'Completed',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
  CANCELLED: {
    label: 'Cancelled',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300',
  },
  RESCHEDULED: {
    label: 'Rescheduled',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300',
  },
}

export const INTERVIEW_TYPES = {
  TECHNICAL: 'Technical Assessment',
  HR: 'HR & Culture Fit',
  BEHAVIORAL: 'Leadership & Behavioral',
}

export const JOB_TYPES = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  REMOTE: 'Remote',
  INTERN: 'Internship',
}
