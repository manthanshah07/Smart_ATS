import React, { useState, useEffect } from 'react'
import { recruiterService } from '../../services/recruiterService'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/button'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { Building, Globe, MapPin, CheckCircle2, ShieldCheck, Save, Loader2 } from 'lucide-react'

export const CompanyProfilePage = () => {
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    location: '',
    description: '',
  })

  useEffect(() => {
    const loadCompany = async () => {
      setLoading(true)
      try {
        const data = await recruiterService.getCompany(1)
        setCompany(data)
        setFormData({
          name: data.name || '',
          website: data.website || '',
          industry: data.industry || '',
          location: data.location || '',
          description: data.description || '',
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadCompany()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await recruiterService.updateCompany(1, formData)
      setCompany(updated)
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
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Employer Organization Profile
            </h1>
            {company?.is_verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Public company identity, domain verification, and branding details shown on job specs.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Company profile updated successfully.</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Organization Identity
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Company Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Industry Domain</label>
              <Input
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="h-9 text-xs"
                placeholder="e.g. Artificial Intelligence / Cloud"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Headquarters Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Official Website</label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="h-9 text-xs"
                placeholder="https://..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1">
                Company Description & Mission
              </label>
              <Textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
