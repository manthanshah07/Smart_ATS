import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { TableSkeleton } from '../../components/ui/Skeleton'

export const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await adminService.getApplications()
        setApplications(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <TableSkeleton rows={5} />

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-border pb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Platform Applications Audit Log
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          System audit log of candidate submissions and deterministic AI match score records.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Candidate</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Position</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Employer</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Status</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">AI Match Score</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Submission Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground">{app.candidate_name}</td>
                  <td className="py-3.5 px-4 text-foreground">{app.job_title}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{app.company_name}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge type="application" status={app.status} />
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {app.ai_analysis ? (
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                        {Math.round(app.ai_analysis.overall_match_score)}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Pending</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                    {new Date(app.applied_at).toLocaleDateString()}
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
