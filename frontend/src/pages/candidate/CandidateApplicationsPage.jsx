import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationService } from '../../services/applicationService'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { formatDate, getMatchScoreFromApp, getMatchLabel, getMatchBadgeClass, cn } from '../../lib/utils'
import { Search, Briefcase } from 'lucide-react'

export const CandidateApplicationsPage = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadApps = async () => {
      setLoading(true)
      try {
        const data = await applicationService.getApplications({ candidate_id: 101, status: statusFilter })
        let filtered = data
        if (search) {
          filtered = filtered.filter(
            (a) =>
              a.job_title.toLowerCase().includes(search.toLowerCase()) ||
              a.company_name.toLowerCase().includes(search.toLowerCase())
          )
        }
        setApplications(filtered)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadApps()
  }, [statusFilter, search])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">My Applications</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track submission history, review progress, and inspect AI match evaluation reports.
          </p>
        </div>
        <Link to="/jobs">
          <Button size="sm" className="text-xs h-8 font-medium gap-1.5">
            <Briefcase className="h-3.5 w-3.5" /> Browse Open Roles
          </Button>
        </Link>
      </div>

      {/* Filter Row */}
      <div className="grid sm:grid-cols-12 gap-3 p-3 rounded-lg border border-border bg-card">
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications by role title or employer..."
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
            <option value="ALL">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="REVIEWING">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="REJECTED">Not Selected</option>
            <option value="HIRED">Hired</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </Select>
        </div>
      </div>

      {/* Applications Data Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications found"
          description={
            search || statusFilter !== 'ALL'
              ? 'No applications match the selected filters.'
              : 'You have not submitted any applications yet.'
          }
          actionText={search || statusFilter !== 'ALL' ? 'Clear Filters' : 'Browse Active Roles'}
          onAction={() => {
            if (search || statusFilter !== 'ALL') {
              setSearch('')
              setStatusFilter('ALL')
            } else {
              window.location.assign('/jobs')
            }
          }}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-muted/20 text-[11px] text-muted-foreground">
            Showing <span className="text-foreground font-semibold">{applications.length}</span> application{applications.length !== 1 ? 's' : ''}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Position & Company</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Applied</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">AI Match</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Status</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {applications.map((app) => {
                  const score = getMatchScoreFromApp(app)
                  const label = getMatchLabel(score)
                  return (
                    <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/candidate/applications/${app.id}`}
                          className="font-semibold text-foreground hover:underline block"
                        >
                          {app.job_title}
                        </Link>
                        <span className="text-[11px] text-muted-foreground">{app.company_name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        {formatDate(app.applied_at)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {score != null ? (
                          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border', getMatchBadgeClass(score))}>
                            {Math.round(score)}% {label}
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground font-mono">Evaluation queued</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge type="application" status={app.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link to={`/candidate/applications/${app.id}`}>
                          <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
                            View Dossier &rarr;
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
