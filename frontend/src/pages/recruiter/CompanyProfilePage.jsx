import React, { useState, useEffect } from 'react'
import { recruiterService } from '../../services/recruiterService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Organization Profile</h1>
        <p className="text-xs text-muted-foreground">Manage your company branding, industry tags, and verified employer status.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" /> {company?.name}
                </CardTitle>
                <CardDescription className="text-xs">Company info visible to job seekers across SmartATS.</CardDescription>
              </div>
              {company?.is_verified && (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-xs gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Employer
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {savedSuccess && (
              <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" /> Company details successfully updated!
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="companyName">
                  Company Name
                </label>
                <Input
                  id="companyName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Acme Technologies"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="website">
                  Website URL
                </label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://acme.io"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="industry">
                  Industry / Sector
                </label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="Enterprise Software, AI, Cloud..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="location">
                  Headquarters Location
                </label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="desc">
                Company Description & Culture
              </label>
              <Textarea
                id="desc"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your organization's mission, values, and engineering culture..."
              />
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/60 py-4 px-6 flex justify-end">
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Company Info
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
