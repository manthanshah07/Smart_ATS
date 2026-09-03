import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { Briefcase, Plus, X, ArrowLeft, Save, Sparkles, CheckCircle2 } from 'lucide-react'

export const JobCreateEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    job_type: 'FULL_TIME',
    experience_min_years: 3,
    required_skills: ['Python', 'Django', 'React', 'PostgreSQL'],
    preferred_skills: ['Docker', 'AWS'],
    description: '',
    status: 'OPEN',
  })

  const [newRequiredSkill, setNewRequiredSkill] = useState('')
  const [newPreferredSkill, setNewPreferredSkill] = useState('')

  useEffect(() => {
    if (isEditing) {
      const fetchJob = async () => {
        try {
          const data = await jobService.getJobById(id)
          setFormData({
            title: data.title || '',
            department: data.department || '',
            location: data.location || '',
            job_type: data.job_type || 'FULL_TIME',
            experience_min_years: data.experience_min_years || 0,
            required_skills: data.required_skills || [],
            preferred_skills: data.preferred_skills || [],
            description: data.description || '',
            status: data.status || 'OPEN',
          })
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchJob()
    }
  }, [id, isEditing])

  const handleAddRequiredSkill = (e) => {
    e.preventDefault()
    if (!newRequiredSkill.trim()) return
    setFormData({
      ...formData,
      required_skills: [...formData.required_skills, newRequiredSkill.trim()],
    })
    setNewRequiredSkill('')
  }

  const handleRemoveRequiredSkill = (skill) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills.filter((s) => s !== skill),
    })
  }

  const handleAddPreferredSkill = (e) => {
    e.preventDefault()
    if (!newPreferredSkill.trim()) return
    setFormData({
      ...formData,
      preferred_skills: [...formData.preferred_skills, newPreferredSkill.trim()],
    })
    setNewPreferredSkill('')
  }

  const handleRemovePreferredSkill = (skill) => {
    setFormData({
      ...formData,
      preferred_skills: formData.preferred_skills.filter((s) => s !== skill),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEditing) {
        await jobService.updateJob(id, formData)
      } else {
        await jobService.createJob(formData)
      }
      setSuccess(true)
      setTimeout(() => {
        navigate('/recruiter/jobs')
      }, 1000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <CardSkeleton />

  return (
    <div className="space-y-6 max-w-4xl">
      <Link to="/recruiter/jobs" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition font-medium">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to job postings
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isEditing ? `Edit Job Posting #${id}` : 'Create New Job Opening'}
          </h1>
          <p className="text-xs text-muted-foreground">
            Define requirements and skills used by SentenceTransformers to match incoming resumes.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold">Role Specifications & Details</CardTitle>
            <CardDescription className="text-xs">Provide clear titles and department categories.</CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {success && (
              <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" /> Job specifications saved successfully!
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="title">
                Job Title
              </label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Backend Python Developer"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="dept">
                  Department
                </label>
                <Input
                  id="dept"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Engineering, Product..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="loc">
                  Location
                </label>
                <Input
                  id="loc"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="San Francisco / Remote"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="type">
                  Employment Type
                </label>
                <Select
                  id="type"
                  value={formData.job_type}
                  onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="REMOTE">Remote</option>
                  <option value="INTERN">Internship</option>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="exp">
                  Minimum Years Experience
                </label>
                <Input
                  id="exp"
                  type="number"
                  min="0"
                  max="20"
                  value={formData.experience_min_years}
                  onChange={(e) => setFormData({ ...formData, experience_min_years: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="status">
                  Posting Status
                </label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="OPEN">Open (Accepting Applications)</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PAUSED">Paused</option>
                  <option value="CLOSED">Closed</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Configuration Card */}
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI Match Criteria & Skills
            </CardTitle>
            <CardDescription className="text-xs">
              These skill taxonomies are evaluated for direct overlap scoring and gap analysis.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Required Skills */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Required Skills ({formData.required_skills.length})
              </label>
              <div className="flex flex-wrap gap-1.5">
                {formData.required_skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium border border-border"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveRequiredSkill(skill)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-md pt-1">
                <Input
                  placeholder="Add required skill (e.g. Python, SQL)..."
                  value={newRequiredSkill}
                  onChange={(e) => setNewRequiredSkill(e.target.value)}
                  className="text-xs"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddRequiredSkill} className="shrink-0 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
            </div>

            {/* Preferred Skills */}
            <div className="space-y-3 pt-4 border-t border-border/60">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                Preferred / Nice-to-Have Skills ({formData.preferred_skills.length})
              </label>
              <div className="flex flex-wrap gap-1.5">
                {formData.preferred_skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background text-foreground text-xs font-medium border border-border"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemovePreferredSkill(skill)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-md pt-1">
                <Input
                  placeholder="Add preferred skill (e.g. Docker, Redis)..."
                  value={newPreferredSkill}
                  onChange={(e) => setNewPreferredSkill(e.target.value)}
                  className="text-xs"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddPreferredSkill} className="shrink-0 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5 pt-4 border-t border-border/60">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="desc">
                Full Job Description
              </label>
              <Textarea
                id="desc"
                rows={6}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Outline responsibilities, team overview, technical architecture, and qualification criteria..."
              />
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/60 py-4 px-6 flex justify-end gap-3">
            <Link to="/recruiter/jobs">
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" size="sm" disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {isEditing ? 'Update Job Posting' : 'Publish Job Opening'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
