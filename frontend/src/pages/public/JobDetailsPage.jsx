import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/applicationService'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Modal } from '../../components/ui/Modal'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import {
  Building,
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  FileText,
  Loader2,
  ExternalLink,
} from 'lucide-react'

export const JobDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isCandidate, isAuthenticated } = useAuth()

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
      }, 1500)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <CardSkeleton />
  if (error || !job) return <ErrorState message={error || 'Job not found'} />

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back Link */}
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition font-medium">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to all jobs
      </Link>

      {/* Main Job Banner */}
      <Card className="border-border shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 bg-muted/20 border-b border-border/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{job.title}</h1>
                <StatusBadge type="job" status={job.status} />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  {job.company_name}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {job.job_type.replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Min. {job.experience_min_years} Years Experience
                </span>
              </div>
            </div>

            {/* Apply Action CTA */}
            <div className="shrink-0">
              {job.status === 'CLOSED' ? (
                <Button disabled className="w-full sm:w-auto">
                  Position Closed
                </Button>
              ) : isAuthenticated && isCandidate ? (
                <Button size="lg" onClick={() => setApplyModalOpen(true)} className="w-full sm:w-auto gap-2 shadow-md">
                  Apply for Position <Send className="h-4 w-4" />
                </Button>
              ) : isAuthenticated ? (
                <Button variant="outline" disabled className="text-xs">
                  Recruiter / Admin View
                </Button>
              ) : (
                <Link to="/login" state={{ from: `/jobs/${job.id}` }}>
                  <Button size="lg" className="w-full sm:w-auto gap-2 shadow-md">
                    Sign In to Apply <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Skill Requirements Grid */}
          <div className="grid md:grid-cols-2 gap-6 p-4 rounded-xl bg-muted/30 border border-border/50">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Required Core Skills ({job.required_skills.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {job.required_skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                Preferred / Nice-to-Have Skills ({job.preferred_skills.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {job.preferred_skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs bg-background">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Job Description Text */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground tracking-tight">Role Description & Specifications</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line text-muted-foreground leading-relaxed text-sm">
              {job.description}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Submit Job Application"
        description={`Applying to ${job.title} at ${job.company_name}`}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setApplyModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleApply} disabled={submitting || applySuccess} className="gap-2">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Evaluating with AI...
                </>
              ) : applySuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Submitted!
                </>
              ) : (
                <>
                  Confirm & Submit <Send className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4 bg-muted/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span>Resume Snapshot Attached</span>
            </div>
            <p className="text-xs text-muted-foreground font-mono bg-background p-2 rounded border border-border">
              {user?.profile?.resume_file || 'Jane_Doe_Resume_2026.pdf'}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Your active resume profile (11 skills extracted) will be snapshotted and evaluated via Sentence Transformers.
            </p>
          </div>

          <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
            <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
            <span>
              Upon submission, our explainable AI pipeline will calculate your semantic fit score, skill overlaps, and notify the recruiter instantly.
            </span>
          </div>
        </div>
      </Modal>
    </div>
  )
}
