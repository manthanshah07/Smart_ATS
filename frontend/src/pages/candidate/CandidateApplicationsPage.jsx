import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationService } from '../../services/applicationService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Search, Building, ArrowRight, Sparkles, Filter, FileSearch } from 'lucide-react'

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
            (a) => a.job_title.toLowerCase().includes(search.toLowerCase()) || a.company_name.toLowerCase().includes(search.toLowerCase())
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Submitted Applications</h1>
          <p className="text-xs text-muted-foreground">
            Track application progression, recruiter screening milestones, and explainable AI scores.
          </p>
        </div>
        <Link to="/jobs">
          <Button size="sm" className="gap-1.5 shadow-xs">
            Browse More Jobs <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by role or company name..."
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
              <option value="HIRED">Hired</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id} className="border-border shadow-2xs hover:border-primary/50 transition">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/candidate/applications/${app.id}`}
                      className="text-base font-bold text-foreground hover:text-primary transition"
                    >
                      {app.job_title}
                    </Link>
                    <StatusBadge type="application" status={app.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Building className="h-3.5 w-3.5 text-muted-foreground" />
                      {app.company_name}
                    </span>
                    <span>•</span>
                    <span>Applied on {new Date(app.applied_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Score and CTA */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                  {app.ai_analysis && (
                    <div className="text-left md:text-right">
                      <div className="flex items-center md:justify-end gap-1 font-black text-sm text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        {Math.round(app.ai_analysis.overall_match_score)}%
                      </div>
                      <span className="text-[10px] text-muted-foreground block">
                        {app.ai_analysis.matched_skills.length} skills matched
                      </span>
                    </div>
                  )}

                  <Link to={`/candidate/applications/${app.id}`}>
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      View AI Analysis <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileSearch}
          title="No applications matching your filters"
          description="You haven't submitted applications under this status filter yet."
          actionLabel="View All Jobs"
          onAction={() => setStatusFilter('ALL')}
        />
      )}
    </div>
  )
}
