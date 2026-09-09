import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/applicationService'
import { useAuth } from '../../hooks/useAuth'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Modal } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/EmptyState'
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Building,
  CheckCircle2,
  FileText,
  Loader2,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { cn } from '../../lib/utils'

export const JobsPage = () => {
  const { isCandidate, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [loading, setLoading] = useState(true)

  // Filter States
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('ALL')
  const [jobType, setJobType] = useState('ALL')

  // Apply Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [applySuccess, setApplySuccess] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const data = await jobService.getJobs({ search, location, job_type: jobType, status: 'OPEN' })
        setJobs(data)
        if (data.length > 0) {
          // If no job is selected or currently selected job is not in new list, select the first
          if (!selectedJob || !data.find((j) => j.id === selectedJob.id)) {
            setSelectedJob(data[0])
          }
        } else {
          setSelectedJob(null)
        }
      } catch (err) {
        console.error('Error fetching jobs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [search, location, jobType])

  const handleApply = async () => {
    if (!selectedJob) return
    setSubmitting(true)
    try {
      const createdApp = await applicationService.submitApplication(selectedJob.id)
      setApplySuccess(true)
      setTimeout(() => {
        setApplyModalOpen(false)
        setApplySuccess(false)
        navigate(`/candidate/applications/${createdApp.id}`)
      }, 1000)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Filter Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Explore Open Roles</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Verified engineering and product openings evaluated against candidate profiles via explainable semantic matching.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="grid sm:grid-cols-12 gap-3 p-3 rounded-lg border border-border bg-card">
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by role title, skill (Python, React...), or company"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="sm:col-span-3">
            <Select value={location} onChange={(e) => setLocation(e.target.value)} className="h-9 text-xs">
              <option value="ALL">All Locations</option>
              <option value="San Francisco">San Francisco, CA</option>
              <option value="Austin">Austin, TX</option>
              <option value="New York">New York, NY</option>
              <option value="Remote">Remote Only</option>
            </Select>
          </div>

          <div className="sm:col-span-3">
            <Select value={jobType} onChange={(e) => setJobType(e.target.value)} className="h-9 text-xs">
              <option value="ALL">All Employment Types</option>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="REMOTE">Remote</option>
              <option value="INTERN">Internship</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Split-Pane Workspace (2 Columns on Desktop) */}
      {loading ? (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-lg bg-card border border-border p-4 animate-pulse" />
            ))}
          </div>
          <div className="lg:col-span-7 h-96 rounded-lg bg-card border border-border p-6 animate-pulse" />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No open positions match your criteria"
          description="Try broadening your search keywords, location filters, or employment preferences."
          actionText="Reset Filters"
          onAction={() => {
            setSearch('')
            setLocation('ALL')
            setJobType('ALL')
          }}
        />
      ) : (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Job List (Scrollable Stream) */}
          <div className="lg:col-span-5 space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
            <div className="text-[11px] font-medium text-muted-foreground px-1 pb-1">
              Showing <span className="text-foreground font-semibold">{jobs.length}</span> positions
            </div>

            {jobs.map((job) => {
              const isSelected = selectedJob?.id === job.id
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={cn(
                    'p-4 rounded-lg border text-left cursor-pointer transition-all',
                    isSelected
                      ? 'bg-card border-foreground/50 shadow-xs ring-1 ring-foreground/10'
                      : 'bg-card border-border hover:border-foreground/20'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">{job.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{job.company_name}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0">{job.location}</span>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-3 pt-2 border-t border-border/60">
                    <span className="font-medium text-foreground">{job.job_type?.replace('_', ' ')}</span>
                    <span>&bull;</span>
                    <span>{job.experience_level || 'Mid-Senior'}</span>
                    <span>&bull;</span>
                    <span>{job.posted_at || 'Recently posted'}</span>
                  </div>

                  {/* Required Skills Preview */}
                  {job.required_skills && job.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {job.required_skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.required_skills.length > 3 && (
                        <span className="text-[10px] text-muted-foreground self-center">
                          +{job.required_skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right Column: Selected Job Detail View */}
          <div className="lg:col-span-7 sticky top-20">
            {selectedJob ? (
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                {/* Detail Header & Action Panel */}
                <div className="p-6 border-b border-border bg-muted/20">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-bold text-foreground">{selectedJob.title}</h2>
                        <StatusBadge type="job" status={selectedJob.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{selectedJob.company_name}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {selectedJob.location}
                        </span>
                        <span>&bull;</span>
                        <span>{selectedJob.job_type?.replace('_', ' ')}</span>
                        <span>&bull;</span>
                        <span>Min {selectedJob.min_experience_years || 2}+ Years Exp</span>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="shrink-0 flex items-center gap-2">
                      <Link to={`/jobs/${selectedJob.id}`}>
                        <Button variant="outline" size="sm" className="text-xs h-9" title="Open full page view">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => setApplyModalOpen(true)}
                        className="text-xs h-9 px-4 font-medium"
                      >
                        Apply for Role
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Job Content Sections */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-320px)] overflow-y-auto">
                  {/* Summary / Description */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      About the Position
                    </h3>
                    <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">
                      {selectedJob.description}
                    </p>
                  </div>

                  {/* Requirements & Skills */}
                  {selectedJob.required_skills && selectedJob.required_skills.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-border">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Required Core Competencies
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.required_skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground border border-border"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preferred Skills */}
                  {selectedJob.preferred_skills && selectedJob.preferred_skills.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-border">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Preferred Qualifications
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.preferred_skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded text-xs text-muted-foreground bg-muted/40 border border-border"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Company Summary */}
                  <div className="p-4 rounded-md bg-muted/30 border border-border space-y-1 text-xs">
                    <span className="font-semibold text-foreground block">About {selectedJob.company_name}</span>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedJob.company_description ||
                        'Verified enterprise employer hiring through SmartATS explainable recruitment infrastructure.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Apply Confirmation Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => !submitting && setApplyModalOpen(false)}
        title={`Apply to ${selectedJob?.title}`}
      >
        <div className="space-y-4 text-xs">
          {applySuccess ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm text-foreground">Application Submitted</h3>
              <p className="text-muted-foreground">
                Your profile snapshot was transmitted to {selectedJob?.company_name}. Redirecting to your application record...
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 rounded bg-muted/30 border border-border space-y-1">
                <span className="font-semibold text-foreground block">{selectedJob?.title}</span>
                <p className="text-muted-foreground">
                  {selectedJob?.company_name} &bull; {selectedJob?.location}
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                By submitting, your parsed resume profile and verified skills will be evaluated against this job description. Both you and the hiring team will receive an explainable match assessment report.
              </p>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setApplyModalOpen(false)}
                  disabled={submitting}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleApply} disabled={submitting} className="text-xs gap-1.5">
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    'Confirm Application'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
