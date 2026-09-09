import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { jobService } from '../../services/jobService'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { CheckCircle2 } from 'lucide-react'

export const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const loadJobs = async () => {
    setLoading(true)
    try {
      const data = await adminService.getJobs()
      setJobs(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const handleCloseJob = async (jobId) => {
    await jobService.closeJob(jobId)
    setMsg(`Job #${jobId} closed via admin moderation.`)
    setTimeout(() => setMsg(''), 3000)
    loadJobs()
  }

  if (loading) return <TableSkeleton rows={5} />

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-border pb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Platform Job Moderation
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Audit published job postings, check requirement parameters, and enforce listing compliance.
        </p>
      </div>

      {msg && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Position Title</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Employer</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Assigned Recruiter</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Status</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Applicants</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {jobs.map((j) => (
                <tr key={j.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground">{j.title}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{j.company_name}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{j.recruiter_name}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge type="job" status={j.status} />
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-foreground">{j.applicants_count}</td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {j.status !== 'CLOSED' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCloseJob(j.id)}
                        className="text-xs h-7 px-2 text-rose-700 hover:bg-rose-50"
                      >
                        Force Close
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
