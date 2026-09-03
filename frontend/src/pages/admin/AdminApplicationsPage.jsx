import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { Layers, Sparkles } from 'lucide-react'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Applications Audit</h1>
        <p className="text-xs text-muted-foreground">Comprehensive system log of candidate submissions and explainable AI scores.</p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider border-b border-border/80">
              <tr>
                <th className="p-4">Candidate</th>
                <th className="p-4">Job Role</th>
                <th className="p-4">Company</th>
                <th className="p-4">Status</th>
                <th className="p-4">AI Fit Score</th>
                <th className="p-4">Applied Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-muted/30 transition">
                  <td className="p-4 font-bold text-foreground">{app.candidate_name}</td>
                  <td className="p-4 text-foreground">{app.job_title}</td>
                  <td className="p-4 text-muted-foreground">{app.company_name}</td>
                  <td className="p-4">
                    <StatusBadge type="application" status={app.status} />
                  </td>
                  <td className="p-4">
                    {app.ai_analysis ? (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {Math.round(app.ai_analysis.overall_match_score)}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Pending</span>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(app.applied_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
