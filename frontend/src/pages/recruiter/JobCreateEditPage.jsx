import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/button'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { Briefcase, Plus, X, ArrowLeft, Save, CheckCircle2, Loader2 } from 'lucide-react'

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
    location: 'San Francisco, CA',
    job_type: 'FULL_TIME',
    experience_min_years: 3,
    required_skills: ['Python', 'Django', 'PostgreSQL'],
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition font-medium"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to job postings
      </Link>

      {/* Header */}
      <div className="border-b border-border pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {isEditing ? 'Edit Job Requisition' : 'Create Job Requisition'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Define requirements and mandatory skills used to calibrate the explainable AI candidate ranking engine.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Job requisition saved successfully. Redirecting...</span>
        </div>
      )}

      {/* Structured Multi-Section Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            1. Role Overview
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Senior Backend Systems Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Department</label>
              <Input
                placeholder="e.g. Core Infrastructure"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Location</label>
              <Input
                placeholder="e.g. San Francisco, CA or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Role Details & Experience */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            2. Employment & Experience Calibration
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Employment Type</label>
              <Select
                value={formData.job_type}
                onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                className="h-9 text-xs"
              >
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="REMOTE">Remote</option>
                <option value="INTERN">Internship</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Minimum Years Experience (10% Model Weight)
              </label>
              <Input
                type="number"
                min="0"
                max="20"
                value={formData.experience_min_years}
                onChange={(e) => setFormData({ ...formData, experience_min_years: Number(e.target.value) })}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Skills Qualification Baseline */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            3. Skills Calibration (30% Match Weight)
          </h2>

          {/* Required Skills */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-foreground">
              Mandatory Required Skills (Evaluated directly against candidate profile)
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded bg-muted/20 border border-border min-h-[50px]">
              {formData.required_skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-card text-foreground border border-border"
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

            <div className="flex gap-2">
              <Input
                placeholder="Add required skill (e.g. Python, SQL, REST APIs)..."
                value={newRequiredSkill}
                onChange={(e) => setNewRequiredSkill(e.target.value)}
                className="h-8 text-xs flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddRequiredSkill}
                className="text-xs h-8 gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
          </div>

          {/* Preferred Skills */}
          <div className="space-y-3 pt-4 border-t border-border">
            <label className="block text-xs font-medium text-foreground">
              Preferred Skills & Nice-to-Haves
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded bg-muted/20 border border-border min-h-[50px]">
              {formData.preferred_skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-muted-foreground bg-card border border-border"
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

            <div className="flex gap-2">
              <Input
                placeholder="Add preferred skill (e.g. Docker, Redis, Kubernetes)..."
                value={newPreferredSkill}
                onChange={(e) => setNewPreferredSkill(e.target.value)}
                className="h-8 text-xs flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPreferredSkill}
                className="text-xs h-8 gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
          </div>
        </div>

        {/* Section 4: Full Job Description */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            4. Role Description (60% Semantic Vector Weight)
          </h2>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Detailed Role Responsibilities & Requirements
            </label>
            <Textarea
              rows={8}
              placeholder="Paste comprehensive role description. The sentence transformer engine uses this text to generate the target semantic vector..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-xs"
              required
            />
          </div>
        </div>

        {/* Section 5: Publishing Status & Action */}
        <div className="rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:w-48">
            <label className="block text-xs font-medium text-foreground mb-1">Requisition Status</label>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="h-9 text-xs"
            >
              <option value="OPEN">Publish as Open</option>
              <option value="DRAFT">Save as Draft</option>
              <option value="PAUSED">Paused</option>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/recruiter/jobs">
              <Button type="button" variant="outline" size="sm" className="text-xs h-9">
                Cancel
              </Button>
            </Link>
            <Button type="submit" size="sm" disabled={saving} className="text-xs h-9 px-5 gap-1.5 font-medium">
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" /> {isEditing ? 'Update Requisition' : 'Publish Requisition'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
