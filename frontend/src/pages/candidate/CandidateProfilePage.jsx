import React, { useState, useEffect } from 'react'
import { candidateService } from '../../services/candidateService'
import { useAuth } from '../../hooks/useAuth'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/button'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { User, Phone, MapPin, Mail, CheckCircle2, Loader2, Save } from 'lucide-react'

export const CandidateProfilePage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [formData, setFormData] = useState({
    headline: '',
    bio: '',
    phone: '',
    location: '',
  })

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      try {
        const data = await candidateService.getProfile()
        setFormData({
          headline: data.headline || '',
          bio: data.bio || '',
          phone: data.phone || '',
          location: data.location || '',
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSavedSuccess(false)
    try {
      await candidateService.updateProfile(formData)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <CardSkeleton />

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Candidate Profile Coordinates
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Personal contact information and professional summary visible to hiring teams.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Profile saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Snapshot */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Verified Account Info
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-3 rounded bg-muted/30 border border-border space-y-1">
              <span className="text-[11px] text-muted-foreground block">Full Name</span>
              <span className="text-xs font-semibold text-foreground">
                {user?.first_name} {user?.last_name || ''}
              </span>
            </div>

            <div className="p-3 rounded bg-muted/30 border border-border space-y-1">
              <span className="text-[11px] text-muted-foreground block">Primary Email</span>
              <span className="text-xs font-semibold text-foreground">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Professional Profile
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1">Professional Headline</label>
              <Input
                placeholder="e.g. Senior Full-Stack Engineer | Python, React, Distributed Systems"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Location</label>
              <Input
                placeholder="e.g. San Francisco, CA (or Remote)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Phone Number</label>
              <Input
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1">Bio Summary</label>
              <Textarea
                rows={4}
                placeholder="Brief professional background summary..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={saving} className="text-xs h-9 px-5 gap-1.5 font-medium">
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
