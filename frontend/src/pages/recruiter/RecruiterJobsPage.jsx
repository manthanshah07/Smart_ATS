import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/button'
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Job Requisitions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage open requisitions, inspect applicant volume, and adjust hiring pipeline status.
          </p>
        </div>
        <Link to="/recruiter/jobs/new">
          <Button size="sm" className="text-xs h-8 gap-1.5 font-medium">
            <Plus className="h-3.5 w-3.5" /> Post New Role
          </Button>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="grid sm:grid-cols-12 gap-3 p-3 rounded-lg border border-border bg-card">
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search job requisitions by title or department..."
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
            <option value="OPEN">Active & Open</option>
            <option value="PAUSED">Paused</option>
            <option value="DRAFT">Draft</option>
            <option value="CLOSED">Closed</option>
          </Select>
        </div>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No job requisitions found"
          description="Create your first job posting to begin receiving applicants evaluated by explainable AI."
          actionText="Create Job Requisition"
          onAction={() => window.location.assign('/recruiter/jobs/new')}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Position</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Department</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Location & Type</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Candidates</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Status</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/recruiter/jobs/${job.id}/applicants`}
                        className="font-semibold text-foreground hover:underline block"
                      >
                        {job.title}
                      </Link>
                      <span className="text-[11px] text-muted-foreground">Posted {job.posted_at || 'Recently'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {job.department || 'Engineering'}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {job.location} &bull; {job.job_type?.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Link
                        to={`/recruiter/jobs/${job.id}/applicants`}
                        className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline"
                      >
                        {job.applicant_count || 4} in queue &rarr;
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge type="job" status={job.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/recruiter/jobs/${job.id}/applicants`}>
                          <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                            Candidates
                          </Button>
                        </Link>
                        <Link to={`/recruiter/jobs/${job.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                            Edit
                          </Button>
                        </Link>
                        {job.status === 'OPEN' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(job.id, job.status)}
                            className="text-xs h-7 px-2 text-amber-700 hover:bg-amber-50"
                            title="Pause Requisition"
                          >
                            Pause
                          </Button>
                        ) : job.status === 'PAUSED' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(job.id, job.status)}
                            className="text-xs h-7 px-2 text-emerald-700 hover:bg-emerald-50"
                            title="Resume Requisition"
                          >
                            Resume
                          </Button>
                        ) : null}
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
