import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationService } from '../../services/applicationService'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { getMatchScoreFromApp, getMatchLabel, getMatchBadgeClass, formatDate, cn } from '../../lib/utils'
import { Search, ArrowUpDown } from 'lucide-react'

/**
 * Full candidate pipeline view across all recruiter's jobs.
 * Supports search, status filtering, and AI score sorting.
 */
export const RecruiterApplicantsPage = () => {
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('score_desc') // 'score_desc', 'score_asc', 'date_desc'

  const loadData = async () => {
    setLoading(true)
    try {
      // Load all applications across the recruiter's jobs (company_id filter added when backend exists)
      const allApps = await applicationService.getApplications({})
      setApplicants(allApps)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = applicants
    .filter((app) => {
      const matchesSearch =
        search === '' ||
        app.candidate_name.toLowerCase().includes(search.toLowerCase()) ||
        app.job_title.toLowerCase().includes(search.toLowerCase()) ||
        (app.candidate_email && app.candidate_email.toLowerCase().includes(search.toLowerCase()))
      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const scoreA = getMatchScoreFromApp(a) ?? -1
      const scoreB = getMatchScoreFromApp(b) ?? -1
      if (sortBy === 'score_desc') return scoreB - scoreA
      if (sortBy === 'score_asc') return scoreA - scoreB
      if (sortBy === 'date_desc') return new Date(b.applied_at) - new Date(a.applied_at)
      return 0
    })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Candidate Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            All candidates across your active job requisitions, ranked by AI match score.
          </p>
        </div>
        <Link to="/recruiter/jobs/new">
          <Button size="sm" className="text-xs h-8 font-medium">
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Filter & Sort Toolbar */}
      <div className="grid sm:grid-cols-12 gap-3 p-3 rounded-lg border border-border bg-card">
        <div className="sm:col-span-5 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates by name, job, or email..."
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
            <option value="REVIEWING">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="REJECTED">Not Selected</option>
          </Select>
        </div>
        <div className="sm:col-span-3">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="score_desc">AI Score: High → Low</option>
            <option value="score_asc">AI Score: Low → High</option>
            <option value="date_desc">Applied: Newest First</option>
          </Select>
        </div>
      </div>

      {/* Candidates Table */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No candidates match filters"
          description="No candidate applications match the selected search or filter criteria."
          actionText="Clear Filters"
          onAction={() => {
            setSearch('')
            setStatusFilter('ALL')
          }}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-muted/20 text-[11px] text-muted-foreground">
            <span className="text-foreground font-semibold">{filtered.length}</span> candidate{filtered.length !== 1 ? 's' : ''} in pipeline
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Candidate</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Applied For</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Experience</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">
                    <div className="flex items-center gap-1">
                      AI Match <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Applied</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Status</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((app) => {
                  const score = getMatchScoreFromApp(app)
                  const label = getMatchLabel(score)
                  return (
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
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/recruiter/jobs/${app.job_id}/applicants`}
                          className="text-foreground hover:underline block truncate max-w-[160px]"
                        >
                          {app.job_title}
                        </Link>
                        <span className="text-[11px] text-muted-foreground">{app.company_name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        {app.candidate_experience_years != null
                          ? `${app.candidate_experience_years} yr${app.candidate_experience_years !== 1 ? 's' : ''}`
                          : '—'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {score != null ? (
                          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border', getMatchBadgeClass(score))}>
                            {Math.round(score)}% {label}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">Pending</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        {formatDate(app.applied_at)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge type="application" status={app.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
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
      )}
    </div>
  )
}
