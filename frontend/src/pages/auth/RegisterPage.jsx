import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/button'
import { AlertCircle, Lock, Mail, User, Briefcase, UserCheck, Loader2, ArrowRight } from 'lucide-react'

export const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('CANDIDATE')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password !== passwordConfirm) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setLoading(true)

    try {
      await register({
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        password,
        password_confirm: passwordConfirm,
        role,
      })

      navigate('/login', {
        state: { message: 'Registration successful. You can now sign in.' },
      })
    } catch (err) {
      const serverErr = err.response?.data
      if (typeof serverErr === 'object' && serverErr !== null) {
        const firstKey = Object.keys(serverErr)[0]
        const firstVal = serverErr[firstKey]
        setError(Array.isArray(firstVal) ? firstVal[0] : String(firstVal))
      } else {
        setError('Registration failed. Please check the provided information.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full rounded-lg border border-border bg-card p-6 sm:p-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Create a SmartATS Account</h1>
        <p className="text-xs text-muted-foreground">
          Join to explore opportunities or manage transparent candidate evaluation.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Segment Toggle */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-foreground">Account Type</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted/40 rounded border border-border">
            <button
              type="button"
              onClick={() => setRole('CANDIDATE')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition ${
                role === 'CANDIDATE'
                  ? 'bg-card text-foreground font-semibold shadow-xs border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="h-3.5 w-3.5" /> Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole('RECRUITER')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition ${
                role === 'RECRUITER'
                  ? 'bg-card text-foreground font-semibold shadow-xs border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" /> Recruiter
            </button>
          </div>
        </div>

        {/* First & Last Name */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">First Name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Last Name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
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

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars"
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Confirm password"
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full text-xs h-9 font-medium gap-2 mt-2">
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Creating Account...
            </>
          ) : (
            <>
              Register Account <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </form>

      <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-foreground hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
