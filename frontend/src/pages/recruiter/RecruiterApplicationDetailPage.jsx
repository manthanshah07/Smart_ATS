import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { applicationService } from '../../services/applicationService'
import { interviewService } from '../../services/interviewService'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { AIAnalysisCard } from '../../components/ui/AIAnalysisCard'
import { Modal } from '../../components/ui/Modal'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { formatDate, formatRelativeDate, cn } from '../../lib/utils'
import {
  User,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Video,
  Loader2,
  GraduationCap,
  Briefcase,
} from 'lucide-react'

export const RecruiterApplicationDetailPage = () => {
  const { id } = useParams()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusMsg, setStatusMsg] = useState('')

  // Interview Modal State
  const [interviewModalOpen, setInterviewModalOpen] = useState(false)
  const [scheduling, setScheduling] = useState(false)
  const [interviewForm, setInterviewForm] = useState({
    interview_type: 'TECHNICAL',
    scheduled_time: '2026-09-15T15:00',
    duration_minutes: 60,
    interviewer_name: 'Alex Vance (Lead Recruiter)',
    meeting_link_or_location: 'https://meet.google.com/xyz-ats-demo',
    preparation_notes: '',
  })

  const loadApp = async () => {
    setLoading(true)
    try {
      const data = await applicationService.getApplicationById(id || 101)
      setApp(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApp()
  }, [id])

  const handleUpdateStatus = async (newStatus) => {
    await applicationService.updateStatus(app.id, newStatus)
    const labels = {
      SHORTLISTED: 'Candidate shortlisted.',
      REJECTED: 'Application marked as not selected.',
      REVIEWING: 'Application moved to review.',
    }
    setStatusMsg(labels[newStatus] || `Status updated to ${newStatus.replace(/_/g, ' ')}.`)
    setTimeout(() => setStatusMsg(''), 4000)
    loadApp()
  }

  const handleScheduleInterview = async (e) => {
    e.preventDefault()
    setScheduling(true)
    try {
      await interviewService.scheduleInterview({
        application_id: app.id,
        candidate_id: app.candidate_id,
        candidate_name: app.candidate_name,
        candidate_email: app.candidate_email,
        job_id: app.job_id,
        job_title: app.job_title,
        company_name: app.company_name,
        ...interviewForm,
      })
      await applicationService.updateStatus(app.id, 'INTERVIEW_SCHEDULED')
      setInterviewModalOpen(false)
      setStatusMsg('Interview scheduled. Candidate will be notified.')
      setTimeout(() => setStatusMsg(''), 5000)
      loadApp()
    } catch (err) {
      console.error(err)
    } finally {
      setScheduling(false)
    }
  }

  if (loading) return <CardSkeleton />
  if (error || !app) return <ErrorState message={error || 'Application record not found'} />

  const resume = app.resume_snapshot || {}
  const skills = resume.skills || []
  const education = resume.education || []
  const experience = resume.experience || []

  const canShortlist = app.status !== 'SHORTLISTED' && app.status !== 'INTERVIEW_SCHEDULED' && app.status !== 'REJECTED'
  const canReject = app.status !== 'REJECTED'
  const canSchedule = app.status !== 'REJECTED' && app.status !== 'WITHDRAWN'

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back Link */}
      <Link
        to={`/recruiter/jobs/${app.job_id}/applicants`}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition font-medium"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to candidate pipeline
      </Link>

      {/* Evaluation Dossier Header */}
      <div className="rounded-lg border border-border bg-card p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {app.candidate_name}
            </h1>
            <StatusBadge type="application" status={app.status} />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {app.candidate_headline && (
              <span className="text-foreground font-medium">{app.candidate_headline}</span>
            )}
            {app.candidate_location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {app.candidate_location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> {app.candidate_email}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Applied for <strong className="text-foreground">{app.job_title}</strong> &bull; {formatDate(app.applied_at)}
          </p>
        </div>

        {/* Recruiter Primary Action Bar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {canShortlist && (
            <Button
              size="sm"
              onClick={() => handleUpdateStatus('SHORTLISTED')}
              className="text-xs h-8 bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
            >
              Shortlist Candidate
            </Button>
          )}

          {canSchedule && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInterviewModalOpen(true)}
              className="text-xs h-8 gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5" /> Schedule Interview
            </Button>
          )}

          {canReject && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateStatus('REJECTED')}
              className="text-xs h-8 text-rose-700 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-200"
            >
              Not Selected
            </Button>
          )}
        </div>
      </div>

      {/* Status Feedback Toast */}
      {statusMsg && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Split Evaluation Workspace */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Resume Dossier (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">

          {/* Resume Skills */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Candidate Resume
              </h2>
              {app.candidate_experience_years != null && (
                <span className="text-[11px] font-mono text-muted-foreground">
                  {app.candidate_experience_years} yr{app.candidate_experience_years !== 1 ? 's' : ''} exp
                </span>
              )}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="space-y-2">
                <span className="text-muted-foreground text-[11px] font-medium block">Extracted Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded text-xs bg-muted text-foreground border border-border">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5" /> Education
                </div>
                {education.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <p className="font-semibold text-foreground">{edu.degree}</p>
                    <p className="text-muted-foreground">{edu.institution} &bull; {edu.year}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5" /> Experience
                </div>
                {experience.map((exp, idx) => (
                  <div key={idx} className="text-xs space-y-0.5">
                    <p className="font-semibold text-foreground">{exp.title}</p>
                    <p className="text-muted-foreground">{exp.company} &bull; {exp.duration}</p>
                    {exp.description && (
                      <p className="text-muted-foreground text-[11px] leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Application Timeline */}
          {app.timeline && app.timeline.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                Application Timeline
              </h3>
              <ol className="space-y-4">
                {app.timeline.map((event, idx) => (
                  <li key={idx} className="relative flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        'h-2 w-2 rounded-full mt-1 shrink-0 border-2',
                        event.done
                          ? event.step === 'REJECTED' ? 'bg-rose-500 border-rose-500' : 'bg-emerald-500 border-emerald-500'
                          : 'bg-muted border-border'
                      )} />
                      {idx < app.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1 min-h-[24px]" />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className="text-xs font-semibold text-foreground">{event.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatRelativeDate(event.date)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Right Column: AI Match Report (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            AI Qualification Assessment
          </h2>
          <AIAnalysisCard analysis={app.ai_analysis} role="recruiter" />
        </div>
      </div>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={interviewModalOpen}
        onClose={() => !scheduling && setInterviewModalOpen(false)}
        title={`Schedule Interview — ${app.candidate_name}`}
      >
        <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs">
          <div>
            <label className="block text-muted-foreground font-medium mb-1">Interview Type</label>
            <Select
              value={interviewForm.interview_type}
              onChange={(e) => setInterviewForm({ ...interviewForm, interview_type: e.target.value })}
              className="h-8 text-xs"
            >
              <option value="TECHNICAL">Technical Interview</option>
              <option value="HR">HR & Culture Assessment</option>
              <option value="BEHAVIORAL">Behavioral & Leadership</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground font-medium mb-1">Date & Time *</label>
              <Input
                type="datetime-local"
                value={interviewForm.scheduled_time}
                onChange={(e) => setInterviewForm({ ...interviewForm, scheduled_time: e.target.value })}
                className="h-8 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-muted-foreground font-medium mb-1">Duration (min) *</label>
              <Input
                type="number"
                min="15"
                max="240"
                value={interviewForm.duration_minutes}
                onChange={(e) => setInterviewForm({ ...interviewForm, duration_minutes: Number(e.target.value) })}
                className="h-8 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground font-medium mb-1">Interviewer Name *</label>
            <Input
              value={interviewForm.interviewer_name}
              onChange={(e) => setInterviewForm({ ...interviewForm, interviewer_name: e.target.value })}
              className="h-8 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-muted-foreground font-medium mb-1">Meeting Link or Location *</label>
            <Input
              value={interviewForm.meeting_link_or_location}
              onChange={(e) => setInterviewForm({ ...interviewForm, meeting_link_or_location: e.target.value })}
              className="h-8 text-xs"
              placeholder="https://meet.google.com/..."
              required
            />
          </div>

          <div>
            <label className="block text-muted-foreground font-medium mb-1">Preparation Notes (optional)</label>
            <Textarea
              value={interviewForm.preparation_notes}
              onChange={(e) => setInterviewForm({ ...interviewForm, preparation_notes: e.target.value })}
              className="text-xs"
              rows={3}
              placeholder="Topics to cover or materials to prepare..."
            />
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setInterviewModalOpen(false)}
              disabled={scheduling}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={scheduling} className="text-xs gap-1.5">
              {scheduling ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Scheduling...</>
              ) : (
                'Confirm Schedule'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
