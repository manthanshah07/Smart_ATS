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
      <div className="h-16 w-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-2">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Access Restricted</h1>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Your current role (<span className="font-mono font-bold text-foreground">{user?.role || 'UNAUTHENTICATED'}</span>) does not possess authorization to view this endpoint or resource.
      </p>
      <div className="pt-4 flex gap-3">
        <Link to={getRoleRedirect()}>
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Return to My Portal
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Home</Button>
        </Link>
      </div>
    </div>
  )
}
