import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/button'
import { LogOut, ArrowRight, Briefcase } from 'lucide-react'

export const Navbar = () => {
  const { user, isAuthenticated, isCandidate, isRecruiter, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard'
    if (isRecruiter) return '/recruiter/dashboard'
    return '/candidate/dashboard'
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 text-foreground hover:opacity-90 transition">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-foreground text-background font-bold text-xs tracking-wider">
              S
            </span>
            <span className="font-semibold text-base tracking-tight">
              Smart<span className="text-muted-foreground font-normal">ATS</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <Link to="/jobs" className="hover:text-foreground transition">
              Explore Roles
            </Link>
            <a href="/#how-it-works" className="hover:text-foreground transition">
              How Matching Works
            </a>
            <a href="/#architecture" className="hover:text-foreground transition">
              Explainable AI
            </a>
          </nav>
        </div>

        {/* Auth / Dashboard Action */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to={getDashboardPath()}>
                <Button size="sm" variant="default" className="text-xs h-8 px-3">
                  Open Workspace &rarr;
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-xs h-8 text-muted-foreground hover:text-foreground"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-xs h-8">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="text-xs h-8 gap-1 font-medium">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
