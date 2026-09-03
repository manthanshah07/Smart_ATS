import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { AlertCircle, Lock, Mail, Loader2, ArrowRight } from 'lucide-react'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const successMessage = location.state?.message

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!email || !password) {
      setError('Please enter both email and password.')
      setLoading(false)
      return
    }

    try {
      const loggedInUser = await login(email.trim(), password)
      // Centralized Role-Based Redirection
      if (loggedInUser.role === 'CANDIDATE') {
        navigate('/candidate/dashboard')
      } else if (loggedInUser.role === 'RECRUITER') {
        navigate('/recruiter/dashboard')
      } else if (loggedInUser.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      const serverErr = err.response?.data
      if (typeof serverErr === 'object' && serverErr !== null) {
        const firstErrorKey = Object.keys(serverErr)[0]
        const firstErrorVal = serverErr[firstErrorKey]
        setError(Array.isArray(firstErrorVal) ? firstErrorVal[0] : String(firstErrorVal))
      } else {
        setError(err.response?.data?.detail || 'Invalid email or password. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-lg border-border/60">
      <CardHeader className="space-y-1 text-left">
        <CardTitle className="text-2xl font-bold tracking-tight">Sign In to SmartATS</CardTitle>
        <CardDescription>
          Enter your credentials to access your centralized hiring portal.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {successMessage && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
