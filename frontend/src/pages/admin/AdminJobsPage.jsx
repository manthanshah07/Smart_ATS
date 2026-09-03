import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { jobService } from '../../services/jobService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { Briefcase, Building, XCircle, CheckCircle2 } from 'lucide-react'

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
    setMsg(`Job #${jobId} has been closed by administrator moderation.`)
    setTimeout(() => setMsg(''), 3000)
    loadJobs()
  }

  if (loading) return <TableSkeleton rows={5} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Job Moderation</h1>
        <p className="text-xs text-muted-foreground">Audit, review, and moderate job postings across all registered companies.</p>
      </div>

      {msg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {msg}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider border-b border-border/80">
              <tr>
                <th className="p-4">Job Title</th>
                <th className="p-4">Company</th>
                <th className="p-4">Recruiter</th>
                <th className="p-4">Status</th>
                <th className="p-4">Applicants</th>
                <th className="p-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {jobs.map((j) => (
                <tr key={j.id} className="hover:bg-muted/30 transition">
                  <td className="p-4 font-bold text-foreground">{j.title}</td>
                  <td className="p-4 text-muted-foreground">{j.company_name}</td>
                  <td className="p-4 text-muted-foreground">{j.recruiter_name}</td>
                  <td className="p-4">
                    <StatusBadge type="job" status={j.status} />
                  </td>
                  <td className="p-4 font-mono font-bold text-foreground">{j.applicants_count}</td>
                  <td className="p-4 text-right">
                    {j.status !== 'CLOSED' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCloseJob(j.id)}
                        className="text-xs h-7 text-rose-600 hover:bg-rose-50"
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
