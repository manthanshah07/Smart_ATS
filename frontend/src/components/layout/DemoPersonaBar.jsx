import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { User, Briefcase, ShieldCheck, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export const DemoPersonaBar = () => {
  const isDemoModeEnabled = import.meta.env.VITE_DEMO_MODE !== 'false'
  const [dismissed, setDismissed] = useState(false)

  const { role, switchDemoRole } = useAuth()
  const navigate = useNavigate()

  if (!isDemoModeEnabled || dismissed) {
    return null
  }

  const handleSwitch = (newRole, targetPath) => {
    switchDemoRole(newRole)
    navigate(targetPath)
  }

  return (
    <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1 border-b border-slate-800 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2 min-w-0">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
        <span className="font-medium text-slate-300 text-[11px] truncate">
          Persona View:
        </span>
        <span className="font-mono bg-slate-800 text-slate-200 px-1.5 py-0.2 rounded text-[10px] uppercase">
          {role || 'PUBLIC'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => handleSwitch('CANDIDATE', '/candidate/dashboard')}
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition',
            role === 'CANDIDATE'
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          )}
        >
          <User className="h-3 w-3" /> Candidate
        </button>

        <button
          type="button"
          onClick={() => handleSwitch('RECRUITER', '/recruiter/dashboard')}
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition',
            role === 'RECRUITER'
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          )}
        >
          <Briefcase className="h-3 w-3" /> Recruiter
        </button>

        <button
          type="button"
          onClick={() => handleSwitch('ADMIN', '/admin/dashboard')}
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition',
            role === 'ADMIN'
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          )}
        >
          <ShieldCheck className="h-3 w-3" /> Admin
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="ml-2 p-0.5 rounded text-slate-500 hover:text-slate-300 transition"
          title="Dismiss Persona Bar"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Dismiss</span>
        </button>
      </div>
    </div>
  )
}
