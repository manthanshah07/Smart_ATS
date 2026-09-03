import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { recruiterService } from '../../services/recruiterService'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/applicationService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import {
  Sparkles,
  Search,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Info,
} from 'lucide-react'

export const JobApplicantsPage = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Status Action Feedback
  const [actionSuccess, setActionSuccess] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const [jobData, applicantList] = await Promise.all([
        jobService.getJobById(id || 1),
        recruiterService.getApplicantsForJob(id || 1),
      ])
      setJob(jobData)
      setApplicants(applicantList)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleUpdateStatus = async (appId, newStatus) => {
    await applicationService.updateStatus(appId, newStatus)
    setActionSuccess(`Applicant #${appId} updated to ${newStatus.replace('_', ' ')}`)
    setTimeout(() => setActionSuccess(''), 3000)
    loadData()
  }

  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch = app.candidate_name.toLowerCase().includes(search.toLowerCase()) ||
      app.candidate_headline.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link to="/recruiter/jobs" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition font-medium">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to job postings
      </Link>

      {/* Header with Title & Explicit Demo Ranking Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Applicant Queue & AI Rankings
            </h1>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 gap-1 font-semibold">
              <Sparkles className="h-3 w-3" /> Sample AI Ranking (Demo)
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Job: <strong className="text-foreground">{job?.title}</strong> ({applicants.length} sample candidate records)
          </p>
        </div>

        {/* Explainability Pill */}
        <div className="hidden lg:flex items-center gap-3 bg-muted/40 p-2.5 rounded-xl border border-border/60 text-xs">
          <span className="font-semibold text-muted-foreground uppercase text-[10px]">Configured Formula:</span>
          <span className="font-mono text-foreground font-bold">Semantic 60% + Skills 30% + Exp 10%</span>
        </div>
      </div>

      {/* Prototype Context Callout */}
      <div className="rounded-lg bg-muted/40 border border-border p-3 text-xs text-muted-foreground flex items-center gap-2">
        <Info className="h-4 w-4 text-primary shrink-0" />
        <span>
          <strong>UI Prototype:</strong> Demonstrates applicant ranking ordering based on sample explainable AI match scores. Real ML inference will be integrated in Phase 5.
        </span>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {actionSuccess}
        </div>
      )}

      {/* Filters Toolbar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by candidate name or headline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs">
              <option value="ALL">All Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="REVIEWING">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
              <option value="REJECTED">Not Selected</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ranked Candidate List */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : filteredApplicants.length > 0 ? (
        <div className="space-y-3">
          {filteredApplicants.map((app, index) => {
            const score = app.ai_analysis?.overall_match_score || 0
            const scoreColor = score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : score >= 60 ? 'text-blue-600' : 'text-amber-600'

            return (
              <Card key={app.id} className="border-border shadow-2xs hover:border-primary/50 transition">
                <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Rank & Candidate Info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-primary/20 shrink-0">
                      #{index + 1}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/recruiter/applications/${app.id}`}
                          className="font-bold text-base text-foreground hover:text-primary transition"
                        >
                          {app.candidate_name}
                        </Link>
                        <StatusBadge type="application" status={app.status} />
                      </div>

                      <p className="text-xs text-muted-foreground truncate">{app.candidate_headline}</p>

                      {/* Skill Tags */}
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {app.ai_analysis?.matched_skills?.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[10px]">
                            ✓ {skill}
                          </Badge>
                        ))}
                        {app.ai_analysis?.missing_skills?.length > 0 && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-[10px]">
                            Missing: {app.ai_analysis.missing_skills[0]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: AI Score Breakdown & Quick Actions */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
                    {/* Score Visual */}
                    <div className="text-left lg:text-right">
                      <div className={`text-xl font-black ${scoreColor} flex items-center gap-1`}>
                        <Sparkles className="h-4 w-4" />
                        {Math.round(score)}%
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Sem {Math.round(app.ai_analysis?.semantic_similarity_score || 0)}% | Skill {Math.round(app.ai_analysis?.skill_match_score || 0)}%
                      </span>
                    </div>

                    {/* Quick Stage Actions */}
                    <div className="flex items-center gap-2">
                      {app.status !== 'SHORTLISTED' && app.status !== 'INTERVIEW_SCHEDULED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                          className="text-xs h-8 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                        >
                          Shortlist
                        </Button>
                      )}

                      {app.status !== 'REJECTED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                          className="text-xs h-8 text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
                        >
                          Reject
                        </Button>
                      )}

                      <Link to={`/recruiter/applications/${app.id}`}>
                        <Button size="sm" className="text-xs h-8 gap-1">
                          Review <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No applicants matching filter"
          description="There are currently no candidates under the selected status filter for this job."
          actionLabel="Show All Applicants"
          onAction={() => setStatusFilter('ALL')}
        />
      )}
    </div>
  )
}
