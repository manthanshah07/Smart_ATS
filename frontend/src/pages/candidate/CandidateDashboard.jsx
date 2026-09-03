import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { applicationService } from '../../services/applicationService'
import { interviewService } from '../../services/interviewService'
import { jobService } from '../../services/jobService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import {
  FileText,
  Briefcase,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Video,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'

export const CandidateDashboard = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [interviews, setInterviews] = useState([])
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      try {
        const [apps, ints, jobs] = await Promise.all([
          applicationService.getApplications({ candidate_id: 101 }),
          interviewService.getInterviews({ candidate_id: 101 }),
          jobService.getJobs({ status: 'OPEN' }),
        ])
        setApplications(apps)
        setInterviews(ints)
        setRecommendedJobs(jobs.slice(0, 2))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) return <CardSkeleton />

  const upcomingInterview = interviews.find((i) => i.status === 'SCHEDULED')

  return (
    <div className="space-y-8">
      {/* 1. WELCOME HERO & PROFILE COMPLETION */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-card to-muted/40 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Candidate Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, {user?.first_name || 'Jane'}!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Your resume profile is active with <strong className="text-foreground">11 extracted skills</strong>. You have 1 upcoming technical interview.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-background/80 p-4 rounded-xl border border-border/60 shrink-0">
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">95%</div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Profile Complete</span>
            </div>
            <Link to="/candidate/profile">
              <Button size="sm" variant="outline" className="text-xs">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-xs">
          <CardHeader className="p-5 flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Submitted Apps</span>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold text-foreground">{applications.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Across 3 verified employers</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="p-5 flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Shortlisted</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold text-emerald-600">
              {applications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">66% shortlisting rate</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="p-5 flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interviews</span>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold text-purple-600">{interviews.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1">1 scheduled this week</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="p-5 flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sample AI Fit Avg</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold text-foreground">83.8%</div>
            <p className="text-[11px] text-muted-foreground mt-1">Prototype reference score</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. UPCOMING INTERVIEW ALERT (IF ANY) */}
      {upcomingInterview && (
        <Card className="border-purple-500/30 bg-purple-500/5 shadow-xs overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-600 flex items-center justify-center shrink-0">
                  <Video className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                      Upcoming Interview
                    </span>
                    <StatusBadge type="interview" status={upcomingInterview.status} />
                  </div>
                  <h4 className="text-base font-bold text-foreground">{upcomingInterview.job_title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {upcomingInterview.company_name} • {new Date(upcomingInterview.scheduled_time).toLocaleString()} ({upcomingInterview.duration_minutes} mins)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a href={upcomingInterview.meeting_link_or_location} target="_blank" rel="noreferrer">
                  <Button size="sm" className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-xs">
                    <Video className="h-3.5 w-3.5" /> Join Google Meet
                  </Button>
                </a>
                <Link to="/candidate/interviews">
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. RECENT APPLICATIONS TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">Recent Applications</h3>
            <p className="text-xs text-muted-foreground">Track hiring stages and explainable AI scores.</p>
          </div>
          <Link to="/candidate/applications">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id} className="border-border shadow-2xs hover:border-primary/40 transition">
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/candidate/applications/${app.id}`}
                      className="font-bold text-sm text-foreground hover:text-primary transition"
                    >
                      {app.job_title}
                    </Link>
                    <StatusBadge type="application" status={app.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {app.company_name} • Applied on {new Date(app.applied_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {app.ai_analysis ? (
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        {Math.round(app.ai_analysis.overall_match_score)}% Match
                      </span>
                      <span className="text-[10px] text-muted-foreground block">
                        Sample Match Score
                      </span>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground gap-1">
                      <Clock className="h-3 w-3" /> Evaluation Pending
                    </Badge>
                  )}

                  <Link to={`/candidate/applications/${app.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Application
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
