import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'

export const ForgotPasswordPage = () => {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Enter your registered email to receive reset instructions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded bg-muted p-4 text-xs text-muted-foreground">
          Password recovery flow will be wired in Phase 2.
        </div>
        <div className="text-xs text-center text-muted-foreground">
          Remember password?{' '}
          <Link to="/login" className="text-primary underline font-medium">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
