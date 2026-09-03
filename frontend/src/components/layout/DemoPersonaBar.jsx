import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Sparkles, User, Briefcase, ShieldCheck, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export const DemoPersonaBar = () => {
  // Check if Demo Mode is enabled via environment variable (default: true for development prototype)
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
    <div className="bg-zinc-900 text-zinc-200 text-xs px-4 py-1.5 border-b border-zinc-800 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span className="font-semibold text-zinc-300 flex items-center gap-1 truncate">
          <Sparkles className="h-3 w-3 text-primary shrink-0" /> Prototype Role Switcher:
        </span>
        <span className="text-zinc-400 hidden sm:inline">Active:</span>
        <span className="font-mono bg-zinc-800 text-primary-foreground px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0">
          {role || 'PUBLIC'}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={() => handleSwitch('CANDIDATE', '/candidate/dashboard')}
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded transition text-[11px] font-medium',
            role === 'CANDIDATE'
              ? 'bg-primary text-primary-foreground font-bold shadow-xs'
              : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          )}
        >
          <User className="h-3 w-3" /> Candidate
        </button>

        <button
          type="button"
          onClick={() => handleSwitch('RECRUITER', '/recruiter/dashboard')}
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded transition text-[11px] font-medium',
            role === 'RECRUITER'
              ? 'bg-primary text-primary-foreground font-bold shadow-xs'
              : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          )}
        >
          <Briefcase className="h-3 w-3" /> Recruiter
        </button>

        <button
          type="button"
          onClick={() => handleSwitch('ADMIN', '/admin/dashboard')}
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded transition text-[11px] font-medium',
            role === 'ADMIN'
              ? 'bg-primary text-primary-foreground font-bold shadow-xs'
              : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          )}
        >
          <ShieldCheck className="h-3 w-3" /> Admin
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="ml-1 p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
          title="Dismiss Prototype Switcher Bar"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Dismiss</span>
        </button>
      </div>
    </div>
  )
}
