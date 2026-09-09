import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/applicationService'
import { interviewService } from '../../services/interviewService'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { getMatchScoreFromApp, getMatchLabel, getMatchBadgeClass, cn } from '../../lib/utils'
import {
  Briefcase,
  Users,
  Plus,
  Calendar,
  Video,
} from 'lucide-react'

export const RecruiterDashboard = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [applicants, setApplicants] = useState([])
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [jobList, appList, intList] = await Promise.all([
          jobService.getJobs({ company_id: 1 }),
          applicationService.getApplications({ job_id: 1 }),
          interviewService.getInterviews(),
        ])
        setJobs(jobList)
        setApplicants(appList)
        setInterviews(intList)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <CardSkeleton />

  const openJobsCount = jobs.filter((j) => j.status === 'OPEN').length
  const shortlistedCount = applicants.filter(
    (a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED'
  ).length
  const upcomingInterview = interviews.find((i) => i.status === 'SCHEDULED')

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. RECRUITER WORKSPACE HEADER */}
      <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Recruiter Workspace
            </h1>
            <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
              TechPulse AI
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Welcome, {user?.first_name || 'Alex'}. You have{' '}
            <strong className="text-foreground">{openJobsCount} open requisition{openJobsCount !== 1 ? 's' : ''}</strong> with{' '}
            <strong className="text-foreground">{applicants.length} candidate{applicants.length !== 1 ? 's' : ''}</strong> in screening.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/recruiter/jobs/new">
            <Button size="sm" className="text-xs h-8 gap-1.5 font-medium">
              <Plus className="h-3.5 w-3.5" /> Post New Job
            </Button>
          </Link>
          <Link to="/recruiter/applicants">
            <Button variant="outline" size="sm" className="text-xs h-8">
              Candidate Pipeline
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. RECRUITER METRICS OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-card border border-border">
        <div className="space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Open Requisitions
          </span>
          <div className="text-2xl font-bold text-foreground">{openJobsCount}</div>
          <span className="text-[11px] text-muted-foreground">{jobs.length} total postings</span>
        </div>

        <div className="space-y-1 sm:border-l sm:border-border sm:pl-4">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Candidates in Screening
          </span>
          <div className="text-2xl font-bold text-foreground">{applicants.length}</div>
          <span className="text-[11px] text-muted-foreground">AI-evaluated queue</span>
        </div>

        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Shortlisted
          </span>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{shortlistedCount}</div>
          <span className="text-[11px] text-muted-foreground">Advanced to interview stage</span>
        </div>

        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Interviews
          </span>
          <div className="text-2xl font-bold text-foreground">{interviews.length}</div>
          <span className="text-[11px] text-muted-foreground">
            {interviews.filter((i) => i.status === 'SCHEDULED').length} upcoming
          </span>
        </div>
      </div>

      {/* 3. UPCOMING INTERVIEW ATTENTION STRIP */}
      {upcomingInterview && (
        <div className="p-4 rounded-lg bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-card border border-border shrink-0 mt-0.5">
              <Calendar className="h-4 w-4 text-foreground" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-xs text-foreground">
                  Upcoming Interview — {upcomingInterview.candidate_name}
                </h3>
                <StatusBadge type="interview" status={upcomingInterview.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                Role: {upcomingInterview.job_title} &bull; {upcomingInterview.scheduled_date} at{' '}
                {upcomingInterview.scheduled_time_display} ({upcomingInterview.duration_minutes} min)
              </p>
            </div>
          </div>

          {upcomingInterview.meeting_link && upcomingInterview.meeting_link.startsWith('http') && (
            <a
              href={upcomingInterview.meeting_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition shrink-0"
            >
              <Video className="h-3.5 w-3.5" /> Launch Interview Call
            </a>
          )}
        </div>
      )}

      {/* 4. WORKSPACE TABLES */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Active Jobs Table (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Active Requisitions</h2>
            <Link to="/recruiter/jobs" className="text-xs text-muted-foreground hover:text-foreground font-medium">
              Manage All ({jobs.length}) &rarr;
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Position</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Type</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Status</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px] text-right">Applicants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {jobs.slice(0, 4).map((job) => (
                  <tr key={job.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3">
                      <Link
                        to={`/recruiter/jobs/${job.id}/applicants`}
                        className="font-semibold text-foreground hover:underline block truncate max-w-[180px]"
                      >
                        {job.title}
                      </Link>
                      <span className="text-[11px] text-muted-foreground">{job.location}</span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                      {job.job_type?.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge type="job" status={job.status} />
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <Link
                        to={`/recruiter/jobs/${job.id}/applicants`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:underline"
                      >
                        {/* Use applicants_count (consistent with mock field name) */}
                        {job.applicants_count ?? 0} &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Candidate Triage Queue (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Candidate Screening Queue</h2>
            <Link
              to="/recruiter/applicants"
              className="text-xs text-muted-foreground hover:text-foreground font-medium"
            >
              Full Pipeline &rarr;
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Candidate</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">AI Match</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Status</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px] text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {applicants.slice(0, 4).map((app) => {
                  const score = getMatchScoreFromApp(app)
                  const label = getMatchLabel(score)
                  return (
                    <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3">
                        <Link
                          to={`/recruiter/applications/${app.id}`}
                          className="font-semibold text-foreground hover:underline block truncate max-w-[160px]"
                        >
                          {app.candidate_name}
                        </Link>
                        <span className="text-[11px] text-muted-foreground">{app.job_title}</span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {score != null ? (
                          <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border', getMatchBadgeClass(score))}>
                            {Math.round(score)}% {label}
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <StatusBadge type="application" status={app.status} />
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <Link to={`/recruiter/applications/${app.id}`}>
                          <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                            Evaluate &rarr;
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
    </div>
  )
}
