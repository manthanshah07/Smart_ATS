import React, { useState, useEffect } from 'react'
import { candidateService } from '../../services/candidateService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/Input'
import { CardSkeleton } from '../../components/ui/Skeleton'
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Sparkles,
  GraduationCap,
  Briefcase,
  Loader2,
  RefreshCw,
} from 'lucide-react'

export const CandidateResumePage = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)

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
    try {
      // Simulate extraction pipeline
      await new Promise((r) => setTimeout(r, 1200))
      const updated = await candidateService.uploadResume(file)
      setProfile((prev) => ({ ...prev, ...updated }))
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 4000)
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (!newSkill.trim()) return
    const updatedSkills = [...(profile?.parsed_skills || []), newSkill.trim()]
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

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Resume & Extracted Competencies</h1>
        <p className="text-xs text-muted-foreground">
          Upload your resume to extract skills, degrees, and work history for explainable AI evaluation.
        </p>
      </div>

      {/* 1. RESUME UPLOAD CARD */}
      <Card className="border-border shadow-xs">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base font-bold">Resume Document Management</CardTitle>
          <CardDescription className="text-xs">
            Supports PDF and DOCX files up to 5MB. NLP extraction runs automatically upon upload.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {uploadSuccess && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Resume parsed successfully! Skills and experience timelines have been updated.</span>
            </div>
          )}

          {/* Current Active Resume Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/60 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">{profile?.resume_file || 'Jane_Doe_Resume_2026.pdf'}</h4>
                <p className="text-[11px] text-muted-foreground">
                  Last parsed: {new Date(profile?.resume_uploaded_at || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Button variant="outline" size="sm" asChild disabled={uploading} className="gap-1.5 pointer-events-none">
                  <span>
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                    {uploading ? 'Extracting NLP...' : 'Replace Resume'}
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Upload Dropzone */}
          <label className="border-2 border-dashed border-border/80 hover:border-primary/60 rounded-xl p-8 text-center flex flex-col items-center justify-center bg-card hover:bg-muted/10 transition cursor-pointer block">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
            </div>
            <p className="text-sm font-semibold text-foreground">
              {uploading ? 'Parsing entities via spaCy...' : 'Click to browse or drag and drop your resume file'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF or DOCX (Max 5MB)</p>
          </label>
        </CardContent>
      </Card>

      {/* 2. EXTRACTED SKILLS */}
      <Card className="border-border shadow-xs">
        <CardHeader className="border-b border-border/60 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Extracted Skills & Competencies ({profile?.parsed_skills?.length || 0})
            </CardTitle>
            <CardDescription className="text-xs">
              Extracted via spaCy rule matching. You can add missing skills or remove false positives.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Skill Tag Badges */}
          <div className="flex flex-wrap gap-2">
            {profile?.parsed_skills?.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium border border-border group"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-muted-foreground hover:text-destructive transition ml-0.5"
                  title="Remove skill"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add Custom Skill Form */}
          <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md pt-2">
            <Input
              placeholder="Add skill (e.g. GraphQL, AWS, Kubernetes)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="text-xs"
            />
            <Button type="submit" size="sm" variant="outline" className="gap-1 shrink-0">
              <Plus className="h-3.5 w-3.5" /> Add Tag
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 3. EXTRACTED EDUCATION & EXPERIENCE */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Education */}
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border/60 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" /> Extracted Education
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {profile?.parsed_education?.length > 0 ? (
              profile.parsed_education.map((edu, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-1">
                  <h4 className="text-xs font-bold text-foreground">{edu.degree}</h4>
                  <p className="text-xs text-muted-foreground">{edu.institution}</p>
                  <span className="text-[10px] text-primary font-mono">{edu.year} • {edu.grade}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">No education entries extracted.</p>
            )}
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border/60 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Extracted Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {profile?.parsed_experience?.length > 0 ? (
              profile.parsed_experience.map((exp, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-foreground">{exp.title}</h4>
                    <span className="text-[10px] text-muted-foreground font-mono">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-primary font-medium">{exp.company}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">{exp.description}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">No work experience entries extracted.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
