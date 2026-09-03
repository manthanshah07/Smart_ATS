import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/button'
import { Sparkles, LogOut, User, Briefcase, LayoutDashboard, Shield } from 'lucide-react'

export const Navbar = () => {
  const { user, isAuthenticated, isCandidate, isRecruiter, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span>Smart<span className="text-foreground">ATS</span></span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/jobs" className="text-muted-foreground transition hover:text-foreground">
            Browse Jobs
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {isCandidate && (
                <>
                  <Link to="/candidate/dashboard" className="text-muted-foreground transition hover:text-foreground">
                    Dashboard
                  </Link>
                  <Link to="/candidate/applications" className="text-muted-foreground transition hover:text-foreground">
                    My Applications
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
                    Users
                  </Link>
                </>
              )}

              <div className="flex items-center gap-3 pl-4 border-l">
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                  {user?.role}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive">
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
