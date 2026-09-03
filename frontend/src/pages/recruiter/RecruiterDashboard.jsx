import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/applicationService'
import { interviewService } from '../../services/interviewService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  ArrowRight,
  ChevronRight,
  TrendingUp,
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
  const shortlistedCount = applicants.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length

  return (
    <div className="space-y-8">
      {/* 1. RECRUITER WELCOME HERO */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-card to-muted/40 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-xs font-semibold">
              <Briefcase className="h-3.5 w-3.5" /> Recruiter Hub • TechPulse AI
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, {user?.first_name || 'Alex'}!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              You have <strong className="text-foreground">{openJobsCount} active job postings</strong> and <strong className="text-foreground">{applicants.length} sample applicants</strong> in the screening queue.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/recruiter/jobs/new">
              <Button className="gap-2 shadow-xs">
                <Plus className="h-4 w-4" /> Post New Job
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. OVERVIEW METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-xs">
          <CardHeader className="p-5 flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Jobs</span>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold text-foreground">{openJobsCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Across 3 departments</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="p-5 flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Applicants</span>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold text-foreground">{applicants.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Prototype candidate records</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="p-5 flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Shortlisted</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold text-emerald-600">{shortlistedCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Qualified candidates</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="p-5 flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interviews</span>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold text-purple-600">{interviews.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Scheduled screening rounds</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. AI-RANKED APPLICANTS QUEUE PREVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Top AI-Ranked Candidates (Job #1)
            </h3>
            <p className="text-xs text-muted-foreground">Sample applicant ranking demonstrating 60/30/10 multi-factor scoring layout.</p>
          </div>
          <Link to="/recruiter/jobs/1/applicants">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              View Full Ranking Table <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {applicants.slice(0, 3).map((app, idx) => (
            <Card key={app.id} className="border-border shadow-2xs hover:border-primary/40 transition">
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/recruiter/applications/${app.id}`}
                        className="font-bold text-sm text-foreground hover:text-primary transition"
                      >
                        {app.candidate_name}
                      </Link>
                      <StatusBadge type="application" status={app.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">{app.candidate_headline}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  {app.ai_analysis && (
                    <div className="text-left sm:text-right">
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        {Math.round(app.ai_analysis.overall_match_score)}% Fit
                      </span>
                      <span className="text-[10px] text-muted-foreground block">
                        Sample Demo Analysis
                      </span>
                    </div>
                  )}

                  <Link to={`/recruiter/applications/${app.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Review Candidate
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. ACTIVE JOBS PREVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight text-foreground">Active Job Postings</h3>
          <Link to="/recruiter/jobs">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              Manage all jobs <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.slice(0, 2).map((job) => (
            <Card key={job.id} className="border-border shadow-2xs">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{job.title}</h4>
                    <p className="text-xs text-muted-foreground">{job.department} • {job.location}</p>
                  </div>
                  <StatusBadge type="job" status={job.status} />
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-border/60">
                  <span className="text-muted-foreground font-semibold">{job.applicants_count} applicants in queue</span>
                  <Link to={`/recruiter/jobs/${job.id}/applicants`}>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      Rankings <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
