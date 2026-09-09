import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import { Button } from '../../components/ui/button'
import { CardSkeleton } from '../../components/ui/Skeleton'
import {
  Users,
  Building,
  Briefcase,
  Layers,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

export const AdminDashboard = () => {
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

  const { platform_overview, applications_by_status, hiring_funnel } = analytics

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. ADMIN CONSOLE HEADER */}
      <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Administration & Governance Console
            </h1>
            <span className="text-[10px] font-mono uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border">
              Platform Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            System overview, user account moderation, employer verification, and recruitment throughput audit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/users">
            <Button size="sm" className="text-xs h-8 font-medium">
              Manage Users
            </Button>
          </Link>
          <Link to="/admin/companies">
            <Button variant="outline" size="sm" className="text-xs h-8">
              Verify Companies
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. PLATFORM VOLUME METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-card border border-border">
        <div className="space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Total Users
          </span>
          <div className="text-2xl font-bold text-foreground">{platform_overview.total_users}</div>
          <span className="text-[11px] text-muted-foreground">
            {platform_overview.total_candidates} Candidates &bull; {platform_overview.total_recruiters} Recruiters
          </span>
        </div>

        <div className="space-y-1 sm:border-l sm:border-border sm:pl-4">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Verified Employers
          </span>
          <div className="text-2xl font-bold text-foreground">{platform_overview.total_companies}</div>
          <span className="text-[11px] text-muted-foreground">{platform_overview.open_jobs} active job postings</span>
        </div>

        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Total Applications
          </span>
          <div className="text-2xl font-bold text-foreground">{platform_overview.total_applications}</div>
          <span className="text-[11px] text-muted-foreground">Processed by matching engine</span>
        </div>

        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Interview Conversion
          </span>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {platform_overview.total_interviews}
          </div>
          <span className="text-[11px] text-muted-foreground">{platform_overview.hired_count} total hires completed</span>
        </div>
      </div>

      {/* 3. AUDIT SECTIONS: APPLICATION FUNNEL & WORKFLOW SHORTCUTS */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Funnel Distribution (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Platform Recruitment Funnel</h2>
            <Link to="/admin/analytics" className="text-xs text-muted-foreground hover:text-foreground font-medium">
              Detailed Analytics &rarr;
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="space-y-3">
              {hiring_funnel.map((step) => {
                const percentage = Math.round((step.count / platform_overview.total_applications) * 100) || 0
                return (
                  <div key={step.stage} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-foreground">{step.stage}</span>
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">{step.count}</strong> ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-foreground h-full transition-all duration-300"
                        style={{ width: `${Math.max(percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Administration Modules (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Governance Modules</h2>

          <div className="space-y-3">
            <Link
              to="/admin/users"
              className="p-3.5 rounded-lg border border-border bg-card hover:border-foreground/20 transition flex items-center justify-between block"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground block">User Account Directory</span>
                <p className="text-[11px] text-muted-foreground">
                  Audit candidate profiles, recruiter permissions, and account status.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>

            <Link
              to="/admin/companies"
              className="p-3.5 rounded-lg border border-border bg-card hover:border-foreground/20 transition flex items-center justify-between block"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground block">Company Verification</span>
                <p className="text-[11px] text-muted-foreground">
                  Review employer domain verifications and business profiles.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>

            <Link
              to="/admin/jobs"
              className="p-3.5 rounded-lg border border-border bg-card hover:border-foreground/20 transition flex items-center justify-between block"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground block">Job Requisition Moderation</span>
                <p className="text-[11px] text-muted-foreground">
                  Audit published role descriptions and mandatory skill parameters.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>

            <Link
              to="/admin/applications"
              className="p-3.5 rounded-lg border border-border bg-card hover:border-foreground/20 transition flex items-center justify-between block"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground block">Application Log & AI Audit</span>
                <p className="text-[11px] text-muted-foreground">
                  Verify deterministic scoring calculations across all submissions.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
