import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { recruiterService } from '../../services/recruiterService'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/applicationService'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { getMatchScoreFromApp, getMatchLabel, getMatchBadgeClass, formatDate, cn } from '../../lib/utils'
import {
  Search,
  ArrowLeft,
  CheckCircle2,
  Calendar,
} from 'lucide-react'

export const JobApplicantsPage = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [actionFeedback, setActionFeedback] = useState('')

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
    setActionFeedback(`Candidate status updated to ${newStatus.replace('_', ' ')}`)
    setTimeout(() => setActionFeedback(''), 3000)
    loadData()
  }

  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.candidate_name.toLowerCase().includes(search.toLowerCase()) ||
      (app.candidate_headline && app.candidate_headline.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back Link */}
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition font-medium"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to job postings
      </Link>

      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Candidate Pipeline
            </h1>
            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
              Requisition #{id || 1}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Role: <strong className="text-foreground">{job?.title || 'Backend Engineer'}</strong> &bull;{' '}
            {applicants.length} candidates evaluated via 60/30/10 matching model.
          </p>
        </div>

        {actionFeedback && (
          <div className="p-2 px-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{actionFeedback}</span>
          </div>
        )}
      </div>

      {/* Filter Row */}
      <div className="grid sm:grid-cols-12 gap-3 p-3 rounded-lg border border-border bg-card">
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates by name or background skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <div className="sm:col-span-4">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="ALL">All Pipeline Stages</option>
            <option value="APPLIED">Applied</option>
            <option value="REVIEWING">In Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="REJECTED">Not Selected</option>
          </Select>
        </div>
      </div>

      {/* High-Density Candidates Table */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : filteredApplicants.length === 0 ? (
        <EmptyState
          title="No candidates match filters"
          description="No candidate applications found for the selected criteria."
          actionText="Clear Search"
          onAction={() => {
            setSearch('')
            setStatusFilter('ALL')
          }}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Candidate</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Experience</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Match Fit</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Key Skills</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Status</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px] text-right">Triage Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/recruiter/applications/${app.id}`}
                        className="font-semibold text-foreground hover:underline block"
                      >
                        {app.candidate_name}
                      </Link>
                      <span className="text-[11px] text-muted-foreground">{app.candidate_email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {app.candidate_experience_years != null ? `${app.candidate_experience_years} yr${app.candidate_experience_years !== 1 ? 's' : ''}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {(() => {
                        const score = getMatchScoreFromApp(app)
                        const label = getMatchLabel(score)
                        return score != null ? (
                          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border', getMatchBadgeClass(score))}>
                            {Math.round(score)}% {label}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Pending</span>
                        )
                      })()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(app.resume_snapshot?.skills || []).slice(0, 3).map((s) => (
                          <span key={s} className="px-1.5 py-0.2 rounded text-[10px] bg-muted text-muted-foreground border border-border">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge type="application" status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/recruiter/applications/${app.id}`}>
                          <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                            Review &rarr;
                          </Button>
                        </Link>
                        {app.status !== 'SHORTLISTED' && app.status !== 'INTERVIEW_SCHEDULED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                            className="text-xs h-7 px-2 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                            title="Shortlist Candidate"
                          >
                            Shortlist
                          </Button>
                        )}
                        {app.status !== 'REJECTED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                            className="text-xs h-7 px-2 text-muted-foreground hover:bg-rose-50 hover:text-rose-700"
                            title="Reject Application"
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
