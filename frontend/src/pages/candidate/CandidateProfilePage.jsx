import React, { useState, useEffect } from 'react'
import { candidateService } from '../../services/candidateService'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/button'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { User, Phone, MapPin, Briefcase, Mail, CheckCircle2, Loader2, Save } from 'lucide-react'

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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Candidate Profile</h1>
        <p className="text-xs text-muted-foreground">
          Manage your personal details, contact coordinates, and professional summary.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold">Personal & Contact Coordinates</CardTitle>
            <CardDescription className="text-xs">
              This information is visible to hiring recruiters when reviewing your applications.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {savedSuccess && (
              <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" /> Profile details saved successfully!
              </div>
            )}

            {/* Readonly Account Data */}
            <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Full Name</label>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {user?.first_name} {user?.last_name}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Email Address</label>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {user?.email}
                </div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="headline">
                  Professional Headline
                </label>
                <Input
                  id="headline"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g. Senior Full-Stack Python & React Engineer"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="phone">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="location">
                    Location / City
                  </label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="bio">
                  Professional Summary & Bio
                </label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Summarize your engineering background, core competencies, and career goals..."
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/60 py-4 px-6 flex justify-end">
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Profile
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
