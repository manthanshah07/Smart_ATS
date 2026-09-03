import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Sparkles, User, Briefcase, ShieldCheck } from 'lucide-react'
import { cn } from '../../lib/utils'

export const DemoPersonaBar = () => {
  const { user, role, switchDemoRole } = useAuth()
  const navigate = useNavigate()

  const handleSwitch = (newRole, targetPath) => {
    switchDemoRole(newRole)
    navigate(targetPath)
  }

  return (
    <div className="bg-zinc-900 text-zinc-200 text-xs px-4 py-1.5 border-b border-zinc-800 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-zinc-300 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-primary" /> Prototype Role Switcher:
        </span>
        <span className="text-zinc-400 hidden sm:inline">Active:</span>
        <span className="font-mono bg-zinc-800 text-primary-foreground px-1.5 py-0.5 rounded text-[11px] font-bold">
          {role || 'PUBLIC'}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => handleSwitch('CANDIDATE', '/candidate/dashboard')}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded transition text-[11px] font-medium',
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
            'flex items-center gap-1 px-2.5 py-1 rounded transition text-[11px] font-medium',
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
            'flex items-center gap-1 px-2.5 py-1 rounded transition text-[11px] font-medium',
            role === 'ADMIN'
              ? 'bg-primary text-primary-foreground font-bold shadow-xs'
              : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          )}
        >
          <ShieldCheck className="h-3 w-3" /> Admin
        </button>
      </div>
    </div>
  )
}
