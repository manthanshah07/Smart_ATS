import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { applicationService } from '../../services/applicationService'
import { interviewService } from '../../services/interviewService'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { AIAnalysisCard } from '../../components/ui/AIAnalysisCard'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { Modal } from '../../components/ui/Modal'
import { formatDate, formatDateTime, formatRelativeDate, cn } from '../../lib/utils'
import {
  Building,
  MapPin,
  ArrowLeft,
  Calendar,
  Video,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react'

// Full application status pipeline (all states)
const ALL_STAGES = [
  { key: 'APPLIED', label: 'Applied', shortLabel: '1. Applied' },
  { key: 'REVIEWING', label: 'Under Review', shortLabel: '2. In Review' },
  { key: 'SHORTLISTED', label: 'Shortlisted', shortLabel: '3. Shortlisted' },
  { key: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', shortLabel: '4. Interview' },
  { key: 'HIRED', label: 'Hired', shortLabel: '5. Hired' },
]

const TERMINAL_STAGES = ['REJECTED', 'WITHDRAWN']

function getStageIndex(status) {
  if (status === 'HIRED') return 4
  if (status === 'INTERVIEW_SCHEDULED') return 3
  if (status === 'SHORTLISTED') return 2
  if (status === 'REVIEWING') return 1
  return 0
}

// Can this application be withdrawn?
function canWithdraw(status) {
  return status === 'APPLIED' || status === 'REVIEWING'
}

export const CandidateApplicationDetailPage = () => {
  const { id } = useParams()
  const [app, setApp] = useState(null)
  const [interview, setInterview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [withdrawing, setWithdrawing] = useState(false)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)

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

  useEffect(() => {
    loadDetail()
  }, [id])

  const handleWithdraw = async () => {
    setWithdrawing(true)
    try {
      await applicationService.withdrawApplication(app.id)
      setWithdrawModalOpen(false)
      loadDetail()
    } catch (err) {
      console.error(err)
    } finally {
      setWithdrawing(false)
    }
  }

  if (loading) return <CardSkeleton />
  if (error || !app) return <ErrorState message={error || 'Application not found'} />

  const isTerminal = TERMINAL_STAGES.includes(app.status)
  const currentStageIdx = isTerminal ? -1 : getStageIndex(app.status)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Link */}
      <Link
        to="/candidate/applications"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition font-medium"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to all applications
      </Link>

      {/* Main Dossier Header */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-foreground">{app.job_title}</h1>
              <StatusBadge type="application" status={app.status} />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                {app.company_name}
              </span>
              {app.company_location && (
                <>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {app.company_location}
                  </span>
                </>
              )}
              <span>&bull;</span>
              <span>Applied {formatDate(app.applied_at)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {canWithdraw(app.status) && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 text-rose-700 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-200"
                onClick={() => setWithdrawModalOpen(true)}
              >
                Withdraw Application
              </Button>
            )}
            <Link to={`/jobs/${app.job_id}`}>
              <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" /> View Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Rejected / Withdrawn State Banner */}
        {app.status === 'REJECTED' && (
          <div className="px-6 py-4 border-b border-border bg-rose-50 dark:bg-rose-950/20 flex items-center gap-3">
            <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 block">Application Not Selected</span>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/70">This application was not advanced to the next stage. You may apply to other open positions.</p>
            </div>
          </div>
        )}
        {app.status === 'WITHDRAWN' && (
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-foreground block">Application Withdrawn</span>
              <p className="text-xs text-muted-foreground">You withdrew this application. You may re-apply if the position is still open.</p>
            </div>
          </div>
        )}

        {/* Pipeline Progress Stepper */}
        {!isTerminal && (
          <div className="p-6 border-b border-border bg-card">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-3">
              Hiring Pipeline Progress
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ALL_STAGES.map((stage, idx) => {
                const isPast = idx < currentStageIdx
                const isCurrent = idx === currentStageIdx
                return (
                  <div
                    key={stage.key}
                    className={cn(
                      'p-2.5 rounded border text-xs relative',
                      isCurrent
                        ? 'bg-foreground text-background font-semibold border-foreground'
                        : isPast
                        ? 'bg-muted/40 text-foreground border-border'
                        : 'bg-card text-muted-foreground border-dashed border-border'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{stage.shortLabel}</span>
                      {isPast && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                      {isCurrent && <Clock className="h-3 w-3 shrink-0" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Scheduled Interview Section */}
        {interview && (
          <div className="p-6 border-b border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-card border border-border shrink-0">
                <Calendar className="h-4 w-4 text-foreground" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-foreground">
                  {interview.interview_type_label || interview.interview_type} — {interview.status}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {interview.scheduled_date} at {interview.scheduled_time_display} ({interview.duration_minutes} min) &bull;{' '}
                  Interviewer: {interview.interviewer_name}
                </p>
                {interview.preparation_notes && (
                  <p className="text-[11px] text-muted-foreground italic mt-1">
                    Note: {interview.preparation_notes}
                  </p>
                )}
              </div>
            </div>

            {interview.meeting_link && interview.meeting_link.startsWith('http') && (
              <a
                href={interview.meeting_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition shrink-0"
              >
                <Video className="h-3.5 w-3.5" /> Join Video Call
              </a>
            )}
          </div>
        )}

        {/* Split: AI Analysis + Timeline */}
        <div className="grid lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Left: AI Assessment */}
          <div className="lg:col-span-8 p-6 space-y-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              AI Match Assessment
            </h2>
            <AIAnalysisCard analysis={app.ai_analysis} role="candidate" />
          </div>

          {/* Right: Application Timeline */}
          <div className="lg:col-span-4 p-6 space-y-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Application Timeline
            </h2>
            {app.timeline && app.timeline.length > 0 ? (
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
                        <div className="w-px flex-1 bg-border mt-1 mb-0 min-h-[24px]" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-xs font-semibold text-foreground">{event.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatRelativeDate(event.date)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-muted-foreground">No timeline events yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Withdraw Confirmation Modal */}
      <Modal
        isOpen={withdrawModalOpen}
        onClose={() => !withdrawing && setWithdrawModalOpen(false)}
        title="Withdraw Application"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded bg-muted/30 border border-border space-y-1">
            <span className="font-semibold text-foreground block">{app.job_title}</span>
            <p className="text-muted-foreground">{app.company_name} &bull; Applied {formatDate(app.applied_at)}</p>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Withdrawing this application will remove it from the recruiter's review queue. This action cannot be undone.
          </p>
          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setWithdrawModalOpen(false)}
              disabled={withdrawing}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleWithdraw}
              disabled={withdrawing}
              className="text-xs bg-rose-700 hover:bg-rose-800 text-white gap-1.5"
            >
              {withdrawing ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Withdrawing...</>
              ) : (
                'Withdraw Application'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
