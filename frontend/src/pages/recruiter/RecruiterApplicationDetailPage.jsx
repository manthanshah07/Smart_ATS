import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { applicationService } from '../../services/applicationService'
import { interviewService } from '../../services/interviewService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { AIAnalysisCard } from '../../components/ui/AIAnalysisCard'
import { Modal } from '../../components/ui/Modal'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import {
  User,
  Mail,
  MapPin,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Sparkles,
  Send,
  Loader2,
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
    setStatusMsg(`Application marked as ${newStatus}`)
    setTimeout(() => setStatusMsg(''), 3000)
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
      setStatusMsg('Interview scheduled and invitation dispatched!')
      setTimeout(() => setStatusMsg(''), 4000)
      loadApp()
    } catch (err) {
      console.error(err)
    } finally {
      setScheduling(false)
    }
  }

  if (loading) return <CardSkeleton />
  if (error || !app) return <ErrorState message={error || 'Application not found'} />

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back Link */}
      <Link to={`/recruiter/jobs/${app.job_id}/applicants`} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition font-medium">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to applicant rankings
      </Link>

      {/* Candidate Profile Header Card */}
      <Card className="border-border shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 bg-muted/20 border-b border-border/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary font-bold text-xl flex items-center justify-center border border-primary/20 shrink-0">
                {app.candidate_name[0]}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">{app.candidate_name}</h1>
                  <StatusBadge type="application" status={app.status} />
                </div>
                <p className="text-xs text-muted-foreground font-medium">{app.candidate_headline}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {app.candidate_email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {app.candidate_location || 'San Francisco, CA'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recruiter Action Controls */}
            <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus('REVIEWING')}
                className="text-xs"
              >
                Mark Reviewing
              </Button>
              <Button
                size="sm"
                onClick={() => handleUpdateStatus('SHORTLISTED')}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Shortlist
              </Button>
              <Button
                size="sm"
                onClick={() => setInterviewModalOpen(true)}
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Calendar className="h-3.5 w-3.5 mr-1" /> Schedule Interview
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleUpdateStatus('REJECTED')}
                className="text-xs"
              >
                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
              </Button>
            </div>
          </div>
        </div>

        {statusMsg && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-3 px-6 text-xs text-emerald-600 font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> {statusMsg}
          </div>
        )}
      </Card>

      {/* Recruiter Explainable AI Analysis */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Recruiter Fit Analysis & NLP Extraction
        </h3>
        <AIAnalysisCard analysis={app.ai_analysis} role="recruiter" />
      </div>

      {/* Candidate Resume Snapshot */}
      <Card className="border-border shadow-xs">
        <CardHeader className="border-b border-border/60 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Candidate Resume Content
          </CardTitle>
          <CardDescription className="text-xs">
            Frozen skills and experience extracted from {app.resume_snapshot?.headline || 'Submitted Resume'}.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Recognized Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {app.resume_snapshot?.skills?.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        title="Schedule Candidate Interview"
        description={`Booking interview for ${app.candidate_name} • ${app.job_title}`}
      >
        <form onSubmit={handleScheduleInterview} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-foreground">Interview Format</label>
            <Select
              value={interviewForm.interview_type}
              onChange={(e) => setInterviewForm({ ...interviewForm, interview_type: e.target.value })}
            >
              <option value="TECHNICAL">Technical Assessment (60 mins)</option>
              <option value="HR">HR & Culture Fit (45 mins)</option>
              <option value="BEHAVIORAL">Behavioral / Leadership (45 mins)</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-foreground">Date & Time</label>
              <Input
                type="datetime-local"
                value={interviewForm.scheduled_time}
                onChange={(e) => setInterviewForm({ ...interviewForm, scheduled_time: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-foreground">Duration (Mins)</label>
              <Input
                type="number"
                value={interviewForm.duration_minutes}
                onChange={(e) => setInterviewForm({ ...interviewForm, duration_minutes: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-foreground">Interviewer(s)</label>
            <Input
              value={interviewForm.interviewer_name}
              onChange={(e) => setInterviewForm({ ...interviewForm, interviewer_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-foreground">Video Conference URL</label>
            <Input
              value={interviewForm.meeting_link_or_location}
              onChange={(e) => setInterviewForm({ ...interviewForm, meeting_link_or_location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-foreground">Preparation / Candidate Notes</label>
            <Textarea
              rows={3}
              value={interviewForm.preparation_notes}
              onChange={(e) => setInterviewForm({ ...interviewForm, preparation_notes: e.target.value })}
              placeholder="e.g. Focus on Django ORM queries and React system architecture..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-border/60">
            <Button type="button" variant="outline" size="sm" onClick={() => setInterviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={scheduling} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
              {scheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Dispatch Calendar Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
