import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { BarChart3, TrendingUp, Users, Briefcase, Layers } from 'lucide-react'

export const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await adminService.getAnalytics()
        setAnalytics(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <CardSkeleton />

  const { monthly_growth, top_demanded_skills, hiring_funnel } = analytics

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Platform Analytics & Hiring Funnel
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Recruitment volume trends, skill frequency metrics, and stage-by-stage candidate progression rates.
        </p>
      </div>

      {/* Trajectory Strip */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Monthly Platform Throughput (2026)
          </h2>
          <span className="text-[11px] text-muted-foreground">Updated in real-time</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {monthly_growth.map((item) => (
            <div key={item.month} className="p-3.5 rounded bg-muted/20 border border-border space-y-2 text-xs">
              <span className="font-semibold text-foreground block">{item.month}</span>
              <div className="space-y-1 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Applications:</span>
                  <span className="font-bold text-foreground font-mono">{item.applications}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jobs Posted:</span>
                  <span className="font-bold text-foreground font-mono">{item.jobs}</span>
                </div>
                <div className="flex justify-between">
                  <span>New Users:</span>
                  <span className="font-bold text-foreground font-mono">{item.users}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Skills Demand & Funnel */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Demanded Skills */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Most Demanded Technical Competencies
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Extracted from active job requisitions across all verified employers.
            </p>
          </div>

          <div className="space-y-2">
            {top_demanded_skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between p-2.5 rounded bg-muted/20 border border-border/60 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{skill.name}</span>
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                    {skill.category}
                  </span>
                </div>
                <span className="font-mono text-muted-foreground font-semibold">{skill.count} Requisitions</span>
              </div>
            ))}
          </div>
        </div>

        {/* End-to-End Funnel */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Candidate Progression Funnel
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Conversion throughput from application submission to finalized offer.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {hiring_funnel.map((step) => (
              <div key={step.stage} className="space-y-1 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-foreground">{step.stage}</span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">{step.count}</strong> ({step.conversion})
                  </span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-foreground transition-all duration-300" style={{ width: step.conversion }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
