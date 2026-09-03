import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { NAVIGATION_CONFIG } from './navigationConfig'
import { Sparkles, LogOut, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Badge } from '../ui/badge'

export const Sidebar = ({ onClose }) => {
  const { user, role, logout } = useAuth()
  const location = useLocation()

  const navItems = NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG.CANDIDATE

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="h-16 border-b border-border/70 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <span>Smart<span className="text-foreground">ATS</span></span>
        </Link>
        <Badge variant="outline" className="text-[10px] uppercase font-mono px-1.5 py-0">
          {role}
        </Badge>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {role === 'CANDIDATE' ? 'Candidate Portal' : role === 'RECRUITER' ? 'Recruitment Hub' : 'System Administration'}
        </div>

        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'))
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group',
                isActive
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={cn('h-4 w-4 shrink-0 transition', isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-3 w-3 opacity-70" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer Profile Box */}
      <div className="p-3 border-t border-border/70 bg-muted/20">
        <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/60">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-foreground truncate">
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.email}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
