import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/applicationService'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Modal } from '../../components/ui/Modal'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import {
  Building,
  MapPin,
  Briefcase,
  Clock,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Calendar,
} from 'lucide-react'

export const JobDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isCandidate, isAuthenticated } = useAuth()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Apply Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [applySuccess, setApplySuccess] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true)
      try {
        const data = await jobService.getJobById(id)
        setJob(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  const handleApply = async () => {
    setSubmitting(true)
    try {
      const createdApp = await applicationService.submitApplication(id)
      setApplySuccess(true)
      setTimeout(() => {
        setApplyModalOpen(false)
        navigate(`/candidate/applications/${createdApp.id}`)
      }, 1000)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <CardSkeleton />
  if (error || !job) return <ErrorState message={error || 'Job not found'} />

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back to Job Browser */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition font-medium"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to open roles
      </Link>

      {/* Main Job Dossier */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {/* Header Block */}
        <div className="p-6 sm:p-8 border-b border-border bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{job.title}</h1>
                <StatusBadge type="job" status={job.status} />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-muted-foreground" />
                  {job.company_name}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" /> {job.job_type?.replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Min {job.min_experience_years || 2}+ Yrs
                </span>
              </div>
            </div>

            {/* Apply Action */}
            <div className="shrink-0">
              <Button size="lg" onClick={() => setApplyModalOpen(true)} className="text-xs h-10 px-6 font-medium">
                Apply for Position
              </Button>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="p-6 sm:p-8 grid md:grid-cols-12 gap-8">
          {/* Main Description & Skills (8 Cols) */}
          <div className="md:col-span-8 space-y-8">
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Position Overview
              </h2>
              <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.required_skills && job.required_skills.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-border">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Required Core Competencies
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {job.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded text-xs font-medium bg-muted text-foreground border border-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {job.preferred_skills && job.preferred_skills.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-border">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Preferred Qualifications
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {job.preferred_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded text-xs font-medium bg-muted/40 text-muted-foreground border border-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Metadata (4 Cols) */}
          <div className="md:col-span-4 space-y-6">
            <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-3">
              <h3 className="font-semibold text-xs text-foreground">Role Specifications</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Department</span>
                  <span className="font-medium text-foreground">{job.department || 'Engineering'}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Experience Level</span>
                  <span className="font-medium text-foreground">{job.experience_level || 'Mid-Senior'}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Location Type</span>
                  <span className="font-medium text-foreground">{job.location}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Posted Date</span>
                  <span className="font-medium text-foreground">{job.posted_at || 'Recent'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border space-y-2 text-xs">
              <h3 className="font-semibold text-foreground">About {job.company_name}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {job.company_description ||
                  'Verified enterprise employer hiring through SmartATS explainable recruitment platform.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => !submitting && setApplyModalOpen(false)}
        title={`Apply to ${job.title}`}
      >
        <div className="space-y-4 text-xs">
          {applySuccess ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm text-foreground">Application Submitted</h3>
              <p className="text-muted-foreground">
                Your profile was transmitted to {job.company_name}. Redirecting to your application record...
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 rounded bg-muted/30 border border-border space-y-1">
                <span className="font-semibold text-foreground block">{job.title}</span>
                <p className="text-muted-foreground">
                  {job.company_name} &bull; {job.location}
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
