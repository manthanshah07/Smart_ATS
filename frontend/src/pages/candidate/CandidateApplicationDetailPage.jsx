import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { applicationService } from '../../services/applicationService'
import { interviewService } from '../../services/interviewService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { AIAnalysisCard } from '../../components/ui/AIAnalysisCard'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import {
  Building,
  MapPin,
  Briefcase,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Video,
  FileText,
  Sparkles,
} from 'lucide-react'

export const CandidateApplicationDetailPage = () => {
  const { id } = useParams()
  const [app, setApp] = useState(null)
  const [interview, setInterview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true)
      try {
        const appData = await applicationService.getApplicationById(id)
        setApp(appData)
        if (appData.interview_id) {
          const intList = await interviewService.getInterviews()
          const matchedInt = intList.find((i) => i.id === appData.interview_id)
          setInterview(matchedInt)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadDetail()
  }, [id])

  if (loading) return <CardSkeleton />
  if (error || !app) return <ErrorState message={error || 'Application not found'} />

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Back Link */}
      <Link to="/candidate/applications" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition font-medium">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to all applications
      </Link>

      {/* Header Banner */}
      <Card className="border-border shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 bg-muted/20 border-b border-border/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{app.job_title}</h1>
                <StatusBadge type="application" status={app.status} />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Building className="h-3.5 w-3.5 text-muted-foreground" />
                  {app.company_name}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {app.company_location}
                </span>
                <span>•</span>
                <span>Applied on {new Date(app.applied_at).toLocaleString()}</span>
              </div>
            </div>

            <Link to={`/jobs/${app.job_id}`}>
              <Button variant="outline" size="sm">
                View Job Spec
              </Button>
            </Link>
          </div>
        </div>

        {/* Application Stage Stepper */}
        <CardContent className="p-6 sm:p-8 space-y-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Recruitment Progress Milestones
          </h3>

          <div className="grid sm:grid-cols-4 gap-4">
            {['APPLIED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW_SCHEDULED'].map((stepKey, idx) => {
              const timelineEvent = app.timeline?.find((t) => t.step === stepKey)
              const isPastOrCurrent = !!timelineEvent

              return (
                <div
                  key={stepKey}
                  className={`p-4 rounded-xl border text-xs space-y-1 transition ${
                    isPastOrCurrent
                      ? 'border-primary/40 bg-primary/5 text-foreground'
                      : 'border-border/50 bg-muted/20 text-muted-foreground opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${isPastOrCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {idx + 1}
                    </span>
                    <span>{stepKey.replace('_', ' ')}</span>
                  </div>
                  {timelineEvent && <p className="text-[11px] text-muted-foreground pt-1">{timelineEvent.date}</p>}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Interview Card (If scheduled) */}
      {interview && (
        <Card className="border-purple-500/30 bg-purple-500/5 shadow-xs">
          <CardHeader className="border-b border-purple-500/20 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
              <Calendar className="h-4 w-4 text-purple-600" />
              Scheduled Interview Details
            </CardTitle>
            <StatusBadge type="interview" status={interview.status} />
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground font-semibold uppercase text-[10px]">Date & Time</span>
                <p className="font-bold text-foreground text-sm mt-0.5">{new Date(interview.scheduled_time).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold uppercase text-[10px]">Format</span>
                <p className="font-bold text-foreground text-sm mt-0.5">{interview.interview_type} ({interview.duration_minutes} mins)</p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold uppercase text-[10px]">Interviewer(s)</span>
                <p className="font-bold text-foreground text-sm mt-0.5">{interview.interviewer_name}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a href={interview.meeting_link_or_location} target="_blank" rel="noreferrer">
                <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                  <Video className="h-4 w-4" /> Open Google Meet Link
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Explainable AI Analysis Component */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Candidate AI Match Evaluation
        </h3>
        <AIAnalysisCard analysis={app.ai_analysis} role="candidate" />
      </div>

      {/* Attached Resume Snapshot Details */}
      <Card className="border-border shadow-xs">
        <CardHeader className="border-b border-border/60 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" /> Frozen Resume Snapshot
          </CardTitle>
          <CardDescription className="text-xs">
            The candidate resume state captured at the moment of evaluation.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {app.resume_snapshot?.skills?.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
