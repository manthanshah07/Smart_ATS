import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
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
    <div className="w-full rounded-lg border border-border bg-card p-6 sm:p-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Sign In to SmartATS</h1>
        <p className="text-xs text-muted-foreground">
          Enter your credentials to access your candidate or recruiter workspace.
        </p>
      </div>

      {successMessage && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1" htmlFor="email">
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
              placeholder="name@example.com"
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-foreground" htmlFor="password">
              Password
            </label>
            <Link to="/forgot-password" tabIndex={-1} className="text-[11px] text-muted-foreground hover:underline">
              Forgot password?
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
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full text-xs h-9 font-medium gap-2">
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Signing In...
            </>
          ) : (
            <>
              Sign In <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </form>

      <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-foreground hover:underline">
          Create account
        </Link>
      </div>
    </div>
  )
}
