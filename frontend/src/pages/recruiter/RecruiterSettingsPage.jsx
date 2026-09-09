import React, { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/Input'
import { CheckCircle2, Save } from 'lucide-react'

export const RecruiterSettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }
    setError('')
    setSaved(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-border pb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Recruiter Security & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Manage your recruiter access credentials, MFA preferences, and organization roles.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Password updated successfully.</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
          {error}
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Change Password
          </h2>

          <div className="space-y-3 max-w-md">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="sm" className="text-xs h-9 px-5 gap-1.5 font-medium">
            <Save className="h-3.5 w-3.5" /> Update Password
          </Button>
        </div>
      </form>
    </div>
  )
}
