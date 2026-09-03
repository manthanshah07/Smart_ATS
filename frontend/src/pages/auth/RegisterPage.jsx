import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'

export const RegisterPage = () => {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>
          Sign up as a Candidate or Recruiter on SmartATS.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded bg-muted p-4 text-xs text-muted-foreground">
          Registration forms with password validation will be connected in Phase 2.
        </div>
        <div className="text-xs text-center text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary underline font-medium">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
