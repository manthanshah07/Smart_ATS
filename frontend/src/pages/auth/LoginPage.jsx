import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

export const LoginPage = () => {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Enter your email and password to access your SmartATS account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded bg-muted p-4 text-xs text-muted-foreground">
          Authentication logic and form handlers will be integrated in Phase 2.
        </div>
        <div className="text-xs text-center text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary underline font-medium">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
