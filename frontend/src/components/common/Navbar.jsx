import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Sparkles, LogOut, User, Briefcase, LayoutDashboard, Shield, ChevronRight } from 'lucide-react'

export const Navbar = () => {
  const { user, isAuthenticated, isCandidate, isRecruiter, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getRoleBadgeVariant = (role) => {
    if (role === 'ADMIN') return 'destructive'
    if (role === 'RECRUITER') return 'secondary'
    return 'default'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary hover:opacity-90 transition">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <span>Smart<span className="text-foreground">ATS</span></span>
        </Link>

        {/* Dynamic Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/jobs" className="text-muted-foreground transition hover:text-foreground">
            Browse Jobs
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-5">
              {isCandidate && (
                <>
                  <Link to="/candidate/dashboard" className="text-muted-foreground transition hover:text-foreground">
                    Dashboard
                  </Link>
                  <Link to="/candidate/applications" className="text-muted-foreground transition hover:text-foreground">
                    Applications
                  </Link>
                  <Link to="/candidate/profile" className="text-muted-foreground transition hover:text-foreground">
                    Profile & Resume
                  </Link>
                </>
              )}

              {isRecruiter && (
                <>
                  <Link to="/recruiter/dashboard" className="text-muted-foreground transition hover:text-foreground">
                    Dashboard
                  </Link>
                  <Link to="/recruiter/jobs" className="text-muted-foreground transition hover:text-foreground">
                    Manage Jobs
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className="text-muted-foreground transition hover:text-foreground">
                    Admin Center
                  </Link>
                  <Link to="/admin/users" className="text-muted-foreground transition hover:text-foreground">
                    User Moderation
                  </Link>
                </>
              )}

              {/* User Identity & Logout */}
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-foreground truncate max-w-[140px]">
                    {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.email}
                  </span>
                  <Badge variant={getRoleBadgeVariant(user?.role)} className="text-[10px] px-1.5 py-0 h-4">
                    {user?.role}
                  </Badge>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="gap-1">
                  Get Started <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
