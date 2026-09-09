import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/button'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export const UnauthorizedPage = () => {
  const { user, isCandidate, isRecruiter, isAdmin } = useAuth()

  const getRoleRedirect = () => {
    if (isCandidate) return '/candidate/dashboard'
    if (isRecruiter) return '/recruiter/dashboard'
    if (isAdmin) return '/admin/dashboard'
    return '/'
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
      <div className="h-12 w-12 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 flex items-center justify-center mb-1">
        <ShieldAlert className="h-6 w-6" />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-foreground">Access Restricted</h1>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Your active role (<span className="font-mono text-foreground font-semibold">{user?.role || 'UNAUTHENTICATED'}</span>) does not possess authorization to access this workspace resource.
      </p>
      <div className="pt-2 flex gap-3">
        <Link to={getRoleRedirect()}>
          <Button size="sm" className="text-xs h-8 gap-1.5 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> Return to My Portal
          </Button>
        </Link>
        <Link to="/">
          <Button size="sm" variant="outline" className="text-xs h-8">
            Platform Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
