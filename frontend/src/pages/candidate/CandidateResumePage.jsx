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
  FolderGit2,
  Award,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Loader2,
  AlertCircle,
  Sparkles,
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
      const updated = await candidateService.uploadResume(file)
      setProfile(updated)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 5000)
    } catch (err) {
      setUploadError('Resume upload failed. Please verify format (PDF or DOCX max 5MB).')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    const skill = newSkill.trim()
    if (!skill) return
    const currentSkills = Array.isArray(profile?.parsed_skills) ? profile.parsed_skills : []
    if (currentSkills.includes(skill)) {
      setNewSkill('')
      return
    }
    const updatedSkills = [...currentSkills, skill]
    setProfile((prev) => ({ ...prev, parsed_skills: updatedSkills }))
    candidateService.updateProfile({ parsed_skills: updatedSkills })
    setNewSkill('')
  }

  const handleRemoveSkill = (skillToRemove) => {
    const currentSkills = Array.isArray(profile?.parsed_skills) ? profile.parsed_skills : []
    const updatedSkills = currentSkills.filter((s) => s !== skillToRemove)
    setProfile((prev) => ({ ...prev, parsed_skills: updatedSkills }))
    candidateService.updateProfile({ parsed_skills: updatedSkills })
  }

  if (loading) return <CardSkeleton />

  const education = Array.isArray(profile?.parsed_education) ? profile.parsed_education : []
  const experience = Array.isArray(profile?.parsed_experience) ? profile.parsed_experience : []
  const projects = Array.isArray(profile?.parsed_projects) ? profile.parsed_projects : []
  const certifications = Array.isArray(profile?.parsed_certifications) ? profile.parsed_certifications : []
  const achievements = Array.isArray(profile?.parsed_achievements) ? profile.parsed_achievements : []
  const contact = profile?.parsed_contact || {}
  const summary = profile?.parsed_summary || profile?.bio || ''
  const validation = profile?.resume_validation || {}
  const resumeFileName = profile?.resume_file || profile?.resume_file_name

  const skillsList = Array.isArray(profile?.parsed_skills) ? profile.parsed_skills : []

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Resume & Extracted Structured Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Automated entity parsing with local spaCy and NLP heuristics. Extracted competencies drive ATS matching algorithms.
          </p>
        </div>

        {validation?.is_valid && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ATS Parsing Score: {validation.score}/100</span>
          </div>
        )}
      </div>

      {/* Main Grid: Upload Sidebar + Parsed Profile */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload & Contact (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upload Card */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Resume Document</span>
              <span className="font-mono text-[10px] text-muted-foreground">PDF / DOCX</span>
            </h2>

            {/* Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-5 text-center space-y-3 transition-colors ${
                uploading ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 text-primary mx-auto animate-spin" />
              ) : (
                <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto" />
              )}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-foreground block">
                  {uploading ? 'Parsing resume content...' : 'Upload or replace resume'}
                </span>
                <p className="text-[11px] text-muted-foreground">Deterministic offline NLP extraction (max 5MB)</p>
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
                  {uploading ? 'Extracting...' : 'Select File'}
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
              <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Resume parsed successfully. Structured profile synchronized.</span>
              </div>
            )}
            {uploadError && (
              <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
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
                  <span>Last parsed:</span>
                  <span>{formatDate(profile?.resume_uploaded_at) || 'Recently'}</span>
                </div>
                {validation?.reason && (
                  <div className="flex justify-between text-muted-foreground pt-1 border-t border-border/50">
                    <span>Validation:</span>
                    <span className={validation.is_valid ? 'text-emerald-600 font-medium' : 'text-amber-600'}>
                      {validation.reason}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contact Coordinates Card */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>Contact Coordinates</span>
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-foreground">
                <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-semibold">{contact.name || profile?.name || 'Name not detected'}</span>
              </div>

              {(contact.email || profile?.email) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{contact.email || profile?.email}</span>
                </div>
              )}

              {(contact.phone || profile?.phone) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{contact.phone || profile?.phone}</span>
                </div>
              )}

              {(contact.location || profile?.location) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{contact.location || profile?.location}</span>
                </div>
              )}

              {contact.linkedin && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Linkedin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {contact.linkedin.replace('https://', '')}
                  </a>
                </div>
              )}

              {contact.github && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Github className="h-3.5 w-3.5 shrink-0" />
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {contact.github.replace('https://', '')}
                  </a>
                </div>
              )}

              {contact.portfolio && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <a
                    href={contact.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {contact.portfolio.replace('https://', '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Extracted Entities & Sections (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Summary / Bio */}
          {summary && (
            <div className="rounded-lg border border-border bg-card p-5 space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Professional Summary
              </h2>
              <p className="text-xs text-foreground/90 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Skills Management */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Verified Skills ({skillsList.length})
              </h2>
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                Standardized Vocabulary
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[52px] p-3 rounded bg-muted/20 border border-border">
              {skillsList.length > 0 ? (
                skillsList.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-card text-foreground border border-border shadow-xs hover:border-primary/40 transition"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-muted-foreground hover:text-rose-500 transition"
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
                placeholder="Add skill manually (e.g. TypeScript, Docker, PyTorch)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="h-8 text-xs flex-1"
              />
              <Button type="submit" size="sm" variant="outline" className="text-xs h-8 gap-1 shrink-0">
                <Plus className="h-3.5 w-3.5" /> Add Skill
              </Button>
            </form>
          </div>

          {/* Experience Entities */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Briefcase className="h-4 w-4" />
              <span>Extracted Experience ({experience.length})</span>
            </div>
            {experience.length > 0 ? (
              <div className="space-y-4 divide-y divide-border">
                {experience.map((exp, idx) => (
                  <div key={idx} className={`text-xs space-y-1 ${idx > 0 ? 'pt-3' : ''}`}>
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <p className="font-semibold text-foreground">{exp.title || exp.role || 'Role'}</p>
                      {exp.duration && (
                        <span className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {exp.duration}
                        </span>
                      )}
                    </div>
                    {exp.company && <p className="text-muted-foreground font-medium">{exp.company}</p>}
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

          {/* Education Entities */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <GraduationCap className="h-4 w-4" />
              <span>Extracted Education ({education.length})</span>
            </div>
            {education.length > 0 ? (
              <div className="space-y-3 divide-y divide-border">
                {education.map((edu, idx) => (
                  <div key={idx} className={`text-xs space-y-0.5 ${idx > 0 ? 'pt-2.5' : ''}`}>
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <p className="font-semibold text-foreground">{edu.degree || 'Degree'}</p>
                      {(edu.year || edu.duration) && (
                        <span className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {edu.year || edu.duration}
                        </span>
                      )}
                    </div>
                    {edu.institution && <p className="text-muted-foreground">{edu.institution}</p>}
                    {(edu.grade || edu.gpa) && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                        {edu.grade || `GPA: ${edu.gpa}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No education records extracted.</p>
            )}
          </div>

          {/* Projects Section */}
          {projects.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <FolderGit2 className="h-4 w-4" />
                <span>Extracted Projects ({projects.length})</span>
              </div>
              <div className="space-y-3 divide-y divide-border">
                {projects.map((proj, idx) => (
                  <div key={idx} className={`text-xs space-y-1.5 ${idx > 0 ? 'pt-2.5' : ''}`}>
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <p className="font-semibold text-foreground">{proj.name || proj.title}</p>
                      {proj.live_link && (
                        <a
                          href={proj.live_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-primary hover:underline"
                        >
                          View Link
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-muted-foreground leading-relaxed text-[11px]">{proj.description}</p>
                    )}
                    {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Achievements Section */}
          {(certifications.length > 0 || achievements.length > 0) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {certifications.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Award className="h-4 w-4" />
                    <span>Certifications</span>
                  </div>
                  <ul className="list-disc list-inside text-xs space-y-1 text-foreground/90">
                    {certifications.map((c, i) => (
                      <li key={i}>{typeof c === 'string' ? c : c.title || c.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {achievements.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Sparkles className="h-4 w-4" />
                    <span>Achievements</span>
                  </div>
                  <ul className="list-disc list-inside text-xs space-y-1 text-foreground/90">
                    {achievements.map((a, i) => (
                      <li key={i}>{typeof a === 'string' ? a : a.title || a.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

