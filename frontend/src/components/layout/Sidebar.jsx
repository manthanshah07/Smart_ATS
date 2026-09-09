import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { NAVIGATION_CONFIG } from './navigationConfig'
import { LogOut } from 'lucide-react'
import { cn } from '../../lib/utils'

export const Sidebar = ({ onClose }) => {
  const { user, role, logout } = useAuth()
  const location = useLocation()

  const navConfig = NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG.CANDIDATE
  const primaryItems = navConfig.primary || []
  const secondaryItems = navConfig.secondary || []

  const renderNavGroup = (items, heading) => (
    <div className="space-y-1">
      {heading && (
        <div className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">
          {heading}
        </div>
      )}
      {items.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path !== '/' && item.path !== '/jobs' && location.pathname.startsWith(item.path + '/'))
        const Icon = item.icon

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors',
              isActive
                ? 'bg-foreground text-background font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0 opacity-80" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )

  return (
    <aside className="w-60 border-r border-border bg-card flex flex-col h-full select-none">
      {/* Workspace Brand Header */}
      <div className="h-14 border-b border-border px-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-foreground text-background font-bold text-[11px]">
            S
          </span>
          <span>SmartATS</span>
        </Link>
        <span className="text-[10px] font-mono uppercase font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {role}
        </span>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {renderNavGroup(primaryItems, role === 'CANDIDATE' ? 'Career' : role === 'RECRUITER' ? 'Recruiting' : 'Management')}
        {secondaryItems.length > 0 && renderNavGroup(secondaryItems, 'Account')}
      </nav>

      {/* Profile & Logout Footer */}
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between p-2 rounded-md bg-card border border-border">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-medium text-foreground truncate">
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.email}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
