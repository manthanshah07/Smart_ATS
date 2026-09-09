import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { MOCK_NOTIFICATIONS } from '../../mock/notifications'
import { Menu, Bell, ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'

export const TopBar = ({ onToggleSidebar }) => {
  const { user, role } = useAuth()
  const location = useLocation()
  const [showNotifs, setShowNotifs] = useState(false)

  const userNotifs = MOCK_NOTIFICATIONS.filter((n) => !n.user_role || n.user_role === role)
  const unreadCount = userNotifs.filter((n) => !n.is_read).length

  // Generate breadcrumb text
  const pathParts = location.pathname.split('/').filter(Boolean)
  const portalName = pathParts[0] ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) : 'Workspace'
  const sectionName = pathParts[1] ? pathParts[1].replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Dashboard'

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur-sm px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Subtle Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{portalName}</span>
          <span className="text-border">/</span>
          <span className="font-medium text-foreground">{sectionName}</span>
        </div>
      </div>

      {/* Right: Public Job Link & Notifications */}
      <div className="flex items-center gap-3">
        <Link to="/jobs">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-1.5 text-xs h-8 text-muted-foreground hover:text-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            Explore Roles
          </Button>
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-foreground" />
            )}
          </button>

          {showNotifs && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-lg border border-border bg-card p-3 shadow-lg z-50 animate-in fade-in zoom-in-95 text-foreground"
              onClick={() => setShowNotifs(false)}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                <span className="font-semibold text-xs text-foreground">Notifications</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {unreadCount} unread
                </span>
              </div>

              <div className="divide-y divide-border/60 max-h-64 overflow-y-auto">
                {userNotifs.length > 0 ? (
                  userNotifs.map((n) => (
                    <Link
                      key={n.id}
                      to={n.link_url || '#'}
                      className="block py-2 px-1 hover:bg-muted/40 rounded transition"
                    >
                      <div className="flex justify-between items-start text-xs">
                        <span className={`text-foreground ${!n.is_read ? 'font-semibold' : 'font-normal'}`}>
                          {n.title}
                        </span>
                        {!n.is_read && <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No notifications</p>
                )}
              </div>

              <div className="pt-2 border-t border-border text-center">
                <Link
                  to={
                    role === 'CANDIDATE'
                      ? '/candidate/notifications'
                      : role === 'RECRUITER'
                      ? '/recruiter/notifications'
                      : '/admin/notifications'
                  }
                  className="text-xs text-muted-foreground hover:text-foreground font-medium"
                >
                  View all notifications &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Monogram */}
        <div className="h-7 w-7 rounded bg-muted text-foreground font-semibold text-xs flex items-center justify-center border border-border">
          {user?.first_name ? user.first_name[0] : 'U'}
        </div>
      </div>
    </header>
  )
}
