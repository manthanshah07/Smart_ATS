import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loader2 } from 'lucide-react'

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading, isCandidate, isRecruiter, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground text-sm">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span>Authenticating session...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to the user's role-appropriate home
    if (isCandidate) return <Navigate to="/candidate/dashboard" replace />
    if (isRecruiter) return <Navigate to="/recruiter/dashboard" replace />
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
