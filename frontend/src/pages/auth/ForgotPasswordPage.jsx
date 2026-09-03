import React, { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import apiClient from '../../services/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { AlertCircle, CheckCircle2, Lock, Mail, Loader2, ArrowRight } from 'lucide-react'

export const ForgotPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const uid = searchParams.get('uid')
  const token = searchParams.get('token')
  const isConfirming = Boolean(uid && token)

  // Request State
  const [email, setEmail] = useState('')
  const [requestSuccess, setRequestSuccess] = useState(false)

  // Confirm State
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [confirmSuccess, setConfirmSuccess] = useState(false)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleRequestSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await apiClient.post('/auth/password-reset/', { email: email.trim() })
      setRequestSuccess(true)
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== newPasswordConfirm) {
      setError('Passwords do not match.')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setLoading(true)

    try {
      await apiClient.post('/auth/password-reset/confirm/', {
        uid,
        token,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      })
      setConfirmSuccess(true)
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful. You may now log in.' } })
      }, 2000)
    } catch (err) {
      const serverErr = err.response?.data
      if (typeof serverErr === 'object' && serverErr !== null) {
        const firstKey = Object.keys(serverErr)[0]
        const firstVal = serverErr[firstKey]
        setError(Array.isArray(firstVal) ? firstVal[0] : String(firstVal))
      } else {
        setError('Invalid or expired reset token. Please request a new link.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-lg border-border/60">
      <CardHeader className="space-y-1 text-left">
        <CardTitle className="text-2xl font-bold tracking-tight">
          {isConfirming ? 'Set New Password' : 'Reset Your Password'}
        </CardTitle>
        <CardDescription>
          {isConfirming
            ? 'Enter and confirm your new secure password.'
            : 'Enter your registered email address to receive password reset instructions.'}
        </CardDescription>
      </CardHeader>

      {isConfirming ? (
        <form onSubmit={handleConfirmSubmit}>
          <CardContent className="space-y-4">
            {confirmSuccess ? (
              <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Password successfully updated! Redirecting to login...</span>
              </div>
            ) : null}

            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="newPassword">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="newPasswordConfirm">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="newPasswordConfirm"
                  type="password"
                  required
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full gap-2" disabled={loading || confirmSuccess}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  Confirm New Password <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      ) : (
        <form onSubmit={handleRequestSubmit}>
          <CardContent className="space-y-4">
            {requestSuccess ? (
              <div className="flex items-start gap-2 rounded-md bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  If an active account with this email exists, instructions to reset your password have been dispatched.
                </span>
              </div>
            ) : null}

            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="email">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full gap-2" disabled={loading || requestSuccess}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Instructions...
                </>
              ) : (
                <>
                  Send Reset Link <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              Remembered your credentials?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Return to Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}
