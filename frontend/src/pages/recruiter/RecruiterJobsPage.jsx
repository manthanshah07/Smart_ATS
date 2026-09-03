import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import {
  Briefcase,
  Plus,
  Search,
  Users,
  Edit,
  PauseCircle,
  PlayCircle,
  XCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

export const RecruiterJobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const loadJobs = async () => {
    setLoading(true)
    try {
      const data = await jobService.getJobs({ company_id: 1, status: statusFilter, search })
      setJobs(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [search, statusFilter])

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'OPEN' ? 'PAUSED' : 'OPEN'
    await jobService.updateJob(jobId, { status: newStatus })
    loadJobs()
  }

  const handleCloseJob = async (jobId) => {
    await jobService.closeJob(jobId)
    loadJobs()
  }

  return (
    <div className="space-y-6">
      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Job Postings Management</h1>
          <p className="text-xs text-muted-foreground">
            Create, monitor, and configure hiring pipelines for open roles across your organization.
          </p>
        </div>
        <Link to="/recruiter/jobs/new">
          <Button size="sm" className="gap-2 shadow-xs">
            <Plus className="h-4 w-4" /> Create New Job
          </Button>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs">
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open & Active</option>
              <option value="PAUSED">Paused</option>
              <option value="DRAFT">Draft</option>
              <option value="CLOSED">Closed</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Listing Table */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : jobs.length > 0 ? (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id} className="border-border shadow-2xs hover:border-primary/40 transition">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Title and Specs */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Link
                      to={`/recruiter/jobs/${job.id}/applicants`}
                      className="text-base font-bold text-foreground hover:text-primary transition"
                    >
                      {job.title}
                    </Link>
                    <StatusBadge type="job" status={job.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>Min {job.experience_min_years} yrs exp</span>
                    <span>•</span>
                    <span>Created {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Applicants Counter & Actions */}
                <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                  <Link to={`/recruiter/jobs/${job.id}/applicants`}>
                    <Button size="sm" className="gap-1.5 text-xs shadow-2xs">
                      <Users className="h-3.5 w-3.5" />
                      <span>{job.applicants_count || 18} Ranked Applicants</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <Link to={`/recruiter/jobs/${job.id}/edit`}>
                      <Button variant="outline" size="sm" className="text-xs h-8 px-2.5" title="Edit Job">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </Link>

                    {job.status !== 'CLOSED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(job.id, job.status)}
                        className="text-xs h-8 px-2.5"
                        title={job.status === 'OPEN' ? 'Pause applications' : 'Resume applications'}
                      >
                        {job.status === 'OPEN' ? <PauseCircle className="h-3.5 w-3.5 text-amber-500" /> : <PlayCircle className="h-3.5 w-3.5 text-emerald-500" />}
                      </Button>
                    )}

                    {job.status !== 'CLOSED' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCloseJob(job.id)}
                        className="text-xs h-8 px-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Close job"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No job postings found"
          description="Create your first job listing to start receiving and ranking applicants with explainable AI."
          actionLabel="Create Job Opening"
          onAction={() => setStatusFilter('ALL')}
        />
      )}
    </div>
  )
}
