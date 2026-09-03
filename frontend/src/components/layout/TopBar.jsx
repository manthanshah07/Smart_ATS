import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { MOCK_NOTIFICATIONS } from '../../mock/notifications'
import { Menu, Bell, Search, ExternalLink, Check } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export const TopBar = ({ onToggleSidebar }) => {
  const { user, role } = useAuth()
  const location = useLocation()
  const [showNotifs, setShowNotifs] = useState(false)

  const userNotifs = MOCK_NOTIFICATIONS.filter((n) => !n.user_role || n.user_role === role)
  const unreadCount = userNotifs.filter((n) => !n.is_read).length

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition">SmartATS</Link>
          <span>/</span>
          <span className="font-semibold text-foreground capitalize">
            {location.pathname.split('/')[2] || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Right: Quick Actions & Notifications & Profile */}
      <div className="flex items-center gap-3">
        <Link to="/jobs">
          <Button variant="ghost" size="sm" className="hidden lg:flex gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            Public Job Board
          </Button>
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            )}
          </button>

          {showNotifs && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-popover p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 text-foreground"
              onClick={() => setShowNotifs(false)}
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-foreground">Notifications</h4>
                <Badge variant="secondary" className="text-[10px]">
                  {unreadCount} Unread
                </Badge>
              </div>

              <div className="divide-y divide-border/60 max-h-72 overflow-y-auto my-2">
                {userNotifs.length > 0 ? (
                  userNotifs.map((n) => (
                    <Link
                      key={n.id}
                      to={n.link_url || '#'}
                      className={`block py-2.5 px-1 hover:bg-muted/40 rounded transition ${!n.is_read ? 'font-medium' : 'text-muted-foreground'}`}
                    >
                      <div className="flex justify-between items-start text-xs">
                        <span className="text-foreground font-semibold">{n.title}</span>
                        {!n.is_read && <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-6">No notifications</p>
                )}
              </div>

              <Link
                to={role === 'CANDIDATE' ? '/candidate/notifications' : role === 'RECRUITER' ? '/recruiter/notifications' : '/admin/notifications'}
                className="block text-center text-xs text-primary hover:underline pt-2 font-medium"
              >
                View all notifications &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
            {user?.first_name ? user.first_name[0] : 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}
