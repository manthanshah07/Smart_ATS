import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { applicationService } from '../../services/applicationService'
import { interviewService } from '../../services/interviewService'
import { jobService } from '../../services/jobService'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { formatDate, getMatchScoreFromApp, getMatchLabel, getMatchBadgeClass, cn } from '../../lib/utils'
import {
  Briefcase,
  Calendar,
  Video,
  ChevronRight,
} from 'lucide-react'

export const CandidateDashboard = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [interviews, setInterviews] = useState([])
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  // Use actual user id if available, fall back to demo candidate id
  const candidateId = user?.id || 101

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      try {
        const [apps, ints, jobs] = await Promise.all([
          applicationService.getApplications({ candidate_id: candidateId }),
          interviewService.getInterviews({ candidate_id: candidateId }),
          jobService.getJobs({ status: 'OPEN' }),
        ])
        setApplications(apps)
        setInterviews(ints)
        setRecommendedJobs(jobs.slice(0, 3))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [candidateId])

  if (loading) return <CardSkeleton />

  const upcomingInterview = interviews.find((i) => i.status === 'SCHEDULED')
  const scheduledCount = interviews.filter((i) => i.status === 'SCHEDULED').length
  const activeCount = applications.filter(
    (a) => a.status === 'SHORTLISTED' || a.status === 'REVIEWING' || a.status === 'INTERVIEW_SCHEDULED'
  ).length

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. WELCOME & CONTEXT HEADER */}
      <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Candidate Workspace
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Welcome back, {user?.first_name || 'Jane'}. You have{' '}
            <strong className="text-foreground">{applications.length} application{applications.length !== 1 ? 's' : ''}</strong> on record
            {scheduledCount > 0 && (
              <> and <strong className="text-foreground">{scheduledCount} upcoming interview{scheduledCount !== 1 ? 's' : ''}</strong></>
            )}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/jobs">
            <Button size="sm" className="text-xs h-8 gap-1.5 font-medium">
              <Briefcase className="h-3.5 w-3.5" /> Explore Open Roles
            </Button>
          </Link>
          <Link to="/candidate/resume">
            <Button variant="outline" size="sm" className="text-xs h-8">
              Update Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. COMPACT METRICS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-card border border-border">
        <div className="space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Total Applications
          </span>
          <div className="text-2xl font-bold text-foreground">{applications.length}</div>
          <span className="text-[11px] text-muted-foreground">Submitted & tracked</span>
        </div>

        <div className="space-y-1 sm:border-l sm:border-border sm:pl-4">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Active Progress
          </span>
          <div className="text-2xl font-bold text-foreground">{activeCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium">In review or shortlisted</span>
        </div>

        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Interviews
          </span>
          <div className="text-2xl font-bold text-foreground">{interviews.length}</div>
          <span className="text-[11px] text-muted-foreground">
            {scheduledCount > 0 ? `${scheduledCount} upcoming` : 'None upcoming'}
          </span>
        </div>

        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Profile Strength
          </span>
          <div className="text-2xl font-bold text-foreground">95%</div>
          <span className="text-[11px] text-muted-foreground">Resume uploaded</span>
        </div>
      </div>

      {/* 3. UPCOMING INTERVIEW ALERT (IF ANY) */}
      {upcomingInterview && (
        <div className="p-4 rounded-lg bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-card border border-border shrink-0 mt-0.5">
              <Calendar className="h-4 w-4 text-foreground" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-xs text-foreground">
                  Upcoming Interview — {upcomingInterview.job_title}
                </h3>
                <StatusBadge type="interview" status={upcomingInterview.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                {upcomingInterview.company_name} &bull; {upcomingInterview.scheduled_date} at{' '}
                {upcomingInterview.scheduled_time_display} ({upcomingInterview.duration_minutes} min)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {upcomingInterview.meeting_link && upcomingInterview.meeting_link.startsWith('http') && (
              <a
                href={upcomingInterview.meeting_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition"
              >
                <Video className="h-3.5 w-3.5" /> Join Meeting
              </a>
            )}
            <Link to="/candidate/interviews">
              <Button variant="outline" size="sm" className="text-xs h-8">
                Details
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 4. MAIN WORKSPACE: ACTIVE APPLICATIONS & RECOMMENDED ROLES */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Applications Table (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Recent Applications</h2>
            <Link
              to="/candidate/applications"
              className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1"
            >
              View all ({applications.length}) &rarr;
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                    <th className="py-2.5 px-4 font-semibold uppercase text-[10px]">Role & Company</th>
                    <th className="py-2.5 px-4 font-semibold uppercase text-[10px]">Applied</th>
                    <th className="py-2.5 px-4 font-semibold uppercase text-[10px]">Match</th>
                    <th className="py-2.5 px-4 font-semibold uppercase text-[10px]">Status</th>
                    <th className="py-2.5 px-4 font-semibold uppercase text-[10px] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {applications.slice(0, 4).map((app) => {
                    const score = getMatchScoreFromApp(app)
                    const label = getMatchLabel(score)
                    return (
                      <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <Link
                            to={`/candidate/applications/${app.id}`}
                            className="font-semibold text-foreground hover:underline block"
                          >
                            {app.job_title}
                          </Link>
                          <span className="text-[11px] text-muted-foreground">{app.company_name}</span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                          {formatDate(app.applied_at)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {score != null ? (
                            <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium border', getMatchBadgeClass(score))}>
                              {Math.round(score)}% {label}
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground font-mono">Queued</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <StatusBadge type="application" status={app.status} />
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <Link to={`/candidate/applications/${app.id}`}>
                            <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                              Review &rarr;
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Curated Roles (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Recommended Openings</h2>
            <Link to="/jobs" className="text-xs text-muted-foreground hover:text-foreground font-medium">
              Browse All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedJobs.map((job) => (
              <div
                key={job.id}
                className="p-3.5 rounded-lg border border-border bg-card hover:border-foreground/20 transition space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-xs font-semibold text-foreground hover:underline block"
                    >
                      {job.title}
                    </Link>
                    <span className="text-[11px] text-muted-foreground">
                      {job.company_name} &bull; {job.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-muted-foreground border-t border-border/60">
                  <span>{job.job_type?.replace('_', ' ')}</span>
                  <Link to={`/jobs/${job.id}`} className="text-foreground hover:underline font-medium">
                    View &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
