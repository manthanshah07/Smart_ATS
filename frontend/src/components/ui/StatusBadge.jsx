import React from 'react'
import { APPLICATION_STATUS, JOB_STATUS, INTERVIEW_STATUS } from '../../lib/statusConfig'
import { cn } from '../../lib/utils'

export const StatusBadge = ({ type = 'application', status, className }) => {
  let config = null

  if (type === 'application') {
    config = APPLICATION_STATUS[status] || { label: status, badgeClass: 'bg-slate-100 text-slate-700' }
  } else if (type === 'job') {
    config = JOB_STATUS[status] || { label: status, badgeClass: 'bg-slate-100 text-slate-700' }
  } else if (type === 'interview') {
    config = INTERVIEW_STATUS[status] || { label: status, badgeClass: 'bg-slate-100 text-slate-700' }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-2xs',
        config?.badgeClass,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {config?.label || status}
    </span>
  )
}
