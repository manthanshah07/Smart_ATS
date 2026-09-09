import React, { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import apiClient from '../../services/api'
import { Button } from '../../components/ui/button'
import { AlertCircle, CheckCircle2, Lock, Mail, Loader2, ArrowRight } from 'lucide-react'

export const ForgotPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const uid = searchParams.get('uid')
  const token = searchParams.get('token')
  const isConfirming = Boolean(uid && token)

  const [email, setEmail] = useState('')
  const [requestSuccess, setRequestSuccess] = useState(false)
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
      }, 1500)
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
    <div className="w-full rounded-lg border border-border bg-card p-6 sm:p-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {isConfirming ? 'Set New Password' : 'Reset Password'}
        </h1>
        <p className="text-xs text-muted-foreground">
          {isConfirming
            ? 'Enter and confirm your new secure password.'
            : 'Enter your registered email address to receive password reset instructions.'}
        </p>
      </div>

      {isConfirming ? (
        <form onSubmit={handleConfirmSubmit} className="space-y-4">
          {confirmSuccess ? (
            <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Password reset successful. Redirecting to sign in...</span>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 chars"
                    className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full text-xs h-9 font-medium gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </>
          )}
        </form>
      ) : (
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          {requestSuccess ? (
            <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>If an account exists for {email}, password reset instructions have been sent.</span>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full text-xs h-9 font-medium gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Dispatching...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </Button>
            </>
          )}
        </form>
      )}

      <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
        Remembered your password?{' '}
        <Link to="/login" className="font-semibold text-foreground hover:underline">
          Return to sign in
        </Link>
      </div>
    </div>
  )
}
