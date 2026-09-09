import React, { useState, useEffect } from 'react'
import { candidateService } from '../../services/candidateService'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/Input'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { formatDate } from '../../lib/utils'
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Plus,
  X,
  GraduationCap,
  Briefcase,
  Loader2,
  AlertCircle,
} from 'lucide-react'

export const CandidateResumePage = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const data = await candidateService.getProfile()
        setProfile(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadSuccess(false)
    setUploadError(null)
    try {
      // Simulate upload + parsing delay
      await new Promise((r) => setTimeout(r, 1200))
      const updated = await candidateService.uploadResume(file)
      setProfile((prev) => ({ ...prev, ...updated }))
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 4000)
    } catch (err) {
      setUploadError('Resume upload failed. Please try again.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    const skill = newSkill.trim()
    if (!skill) return
    if (profile?.parsed_skills?.includes(skill)) {
      setNewSkill('')
      return
    }
    const updatedSkills = [...(profile?.parsed_skills || []), skill]
    setProfile({ ...profile, parsed_skills: updatedSkills })
    candidateService.updateProfile({ parsed_skills: updatedSkills })
    setNewSkill('')
  }

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = (profile?.parsed_skills || []).filter((s) => s !== skillToRemove)
    setProfile({ ...profile, parsed_skills: updatedSkills })
    candidateService.updateProfile({ parsed_skills: updatedSkills })
  }

  if (loading) return <CardSkeleton />

  const education = profile?.parsed_education || []
  const experience = profile?.parsed_experience || []
  const resumeFileName = profile?.resume_file || profile?.resume_file_name

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Resume & Extracted Competencies
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Upload your resume to extract skills, degrees, and experience for AI evaluation. Extracted data is used in all match assessments.
        </p>
      </div>

      {/* Main Grid: Upload + Parsed Profile */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Upload Workspace (5 Cols) */}
        <div className="lg:col-span-5 rounded-lg border border-border bg-card p-5 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Resume Document
          </h2>

          {/* Upload Zone */}
          <div className={`border-2 border-dashed rounded-lg p-6 text-center space-y-3 transition-colors ${
            uploading ? 'border-foreground/30 bg-muted/20' : 'border-border hover:border-foreground/30'
          }`}>
            {uploading ? (
              <Loader2 className="h-8 w-8 text-muted-foreground mx-auto animate-spin" />
            ) : (
              <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto" />
            )}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-foreground block">
                {uploading ? 'Parsing resume content...' : 'Upload or replace resume'}
              </span>
              <p className="text-[11px] text-muted-foreground">PDF or DOCX format (max 5MB)</p>
            </div>

            <label className="inline-block">
              <Button
                variant="outline"
                size="sm"
                disabled={uploading}
                className="text-xs h-8 cursor-pointer gap-1.5"
                type="button"
                onClick={() => document.getElementById('resume-file-input')?.click()}
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                {uploading ? 'Processing...' : 'Select Document'}
              </Button>
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Upload Feedback */}
          {uploadSuccess && (
            <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Resume parsed. Skills and entities have been updated.</span>
            </div>
          )}
          {uploadError && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Active File Metadata */}
          {resumeFileName && !uploading && (
            <div className="p-3 rounded bg-muted/30 border border-border space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>File:</span>
                <span className="font-mono text-foreground font-semibold truncate max-w-[160px]">
                  {resumeFileName}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Last updated:</span>
                <span>{formatDate(profile?.resume_uploaded_at) || 'Recently'}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Parse status:</span>
                <span className="text-emerald-600 font-medium">Processed</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Verified Skills & Extracted Entities (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Skills Management */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Verified Skills ({profile?.parsed_skills?.length || 0})
              </h2>
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                spaCy Extracted
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[52px] p-3 rounded bg-muted/20 border border-border">
              {profile?.parsed_skills?.length > 0 ? (
                profile.parsed_skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-card text-foreground border border-border"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-muted-foreground hover:text-destructive transition"
                      title={`Remove ${skill}`}
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs text-muted-foreground self-center">
                  No skills extracted yet. Upload a resume or add skills manually.
                </p>
              )}
            </div>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="flex gap-2 pt-1">
              <Input
                placeholder="Add skill manually (e.g. GraphQL, Rust, AWS)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="h-8 text-xs flex-1"
              />
              <Button type="submit" size="sm" variant="outline" className="text-xs h-8 gap-1 shrink-0">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </form>
          </div>

          {/* Education Entities */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <GraduationCap className="h-4 w-4" />
              <span>Extracted Education</span>
            </div>
            {education.length > 0 ? (
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-xs space-y-0.5">
                    <p className="font-semibold text-foreground">{edu.degree}</p>
                    <p className="text-muted-foreground">{edu.institution} &bull; {edu.year}</p>
                    {edu.grade && <p className="text-muted-foreground text-[11px]">{edu.grade}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No education records extracted.</p>
            )}
          </div>

          {/* Experience Entities */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Briefcase className="h-4 w-4" />
              <span>Extracted Experience</span>
            </div>
            {experience.length > 0 ? (
              <div className="space-y-4 divide-y divide-border">
                {experience.map((exp, idx) => (
                  <div key={idx} className={`text-xs space-y-0.5 ${idx > 0 ? 'pt-3' : ''}`}>
                    <p className="font-semibold text-foreground">{exp.title}</p>
                    <p className="text-muted-foreground">{exp.company} &bull; {exp.duration}</p>
                    {exp.description && (
                      <p className="text-muted-foreground leading-relaxed text-[11px] mt-1">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No experience records extracted.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
