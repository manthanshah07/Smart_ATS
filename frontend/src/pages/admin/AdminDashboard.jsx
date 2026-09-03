import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import {
  Users,
  Building,
  Briefcase,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Info,
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
    <div className="space-y-8">
      {/* 1. ADMIN OVERVIEW HERO */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-card to-muted/40 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> Platform Governance Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              SmartATS Administration Console
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Centralized interface for auditing user accounts, verifying organization profiles, and monitoring platform volume.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Badge variant="outline" className="text-xs font-mono bg-background">
              Sample Platform Metrics (Demo)
            </Badge>
          </div>
        </div>
      </div>

      {/* Prototype Disclaimer Banner */}
      <div className="rounded-lg bg-muted/40 border border-border p-3 text-xs text-muted-foreground flex items-center gap-2">
        <Info className="h-4 w-4 text-primary shrink-0" />
        <span>
          <strong>UI Prototype:</strong> Metrics and distributions displayed below are structured sample datasets illustrating the administrative monitoring experience.
        </span>
      </div>

      {/* 2. CORE SYSTEM METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-xs">
          <CardHeader className="p-5 flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registered Users</span>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold text-foreground">{platform_overview.total_users}</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {platform_overview.total_candidates} Candidates • {platform_overview.total_recruiters} Recruiters
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="p-5 flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employers</span>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold text-foreground">{platform_overview.total_companies}</div>
            <p className="text-[11px] text-muted-foreground mt-1">{platform_overview.open_jobs} active job postings</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="p-5 flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Applications</span>
            <Layers className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold text-foreground">{platform_overview.total_applications}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Total submitted records</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="p-5 flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sample AI Match Avg</span>
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold text-emerald-600">{platform_overview.average_match_score}%</div>
            <p className="text-[11px] text-muted-foreground mt-1">Reference dataset average</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. APPLICATION STATUS DISTRIBUTION & HIRING FUNNEL */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border/60 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">Applications by Recruitment Stage</CardTitle>
              <CardDescription className="text-xs">Distribution sample across platform job openings.</CardDescription>
            </div>
            <Link to="/admin/applications">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Audit Table <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="p-6 space-y-3.5">
            {applications_by_status.map((item) => (
              <div key={item.status} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted-foreground font-mono">{item.count} ({item.pct}%)</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Hiring Funnel */}
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border/60 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">Recruitment Pipeline Funnel</CardTitle>
              <CardDescription className="text-xs">Sample progression rates through each stage.</CardDescription>
            </div>
            <Link to="/admin/analytics">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Details <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="p-6 space-y-3">
            {hiring_funnel.map((step, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-muted/20 border border-border/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-md bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-foreground">{step.stage}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-foreground font-mono">{step.count}</span>
                  <Badge variant="outline" className="text-[10px] font-mono bg-background">
                    {step.conversion}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 4. ADMIN SHORTCUT PANELS */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/admin/users" className="block group">
          <Card className="border-border hover:border-primary/40 transition shadow-2xs h-full">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition">User Directory</h4>
                <p className="text-xs text-muted-foreground">Manage roles and activate/deactivate accounts.</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 ml-2" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/companies" className="block group">
          <Card className="border-border hover:border-primary/40 transition shadow-2xs h-full">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition">Company Verification</h4>
                <p className="text-xs text-muted-foreground">Audit employers and verify credentials.</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 ml-2" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/jobs" className="block group">
          <Card className="border-border hover:border-primary/40 transition shadow-2xs h-full">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition">Job Moderation</h4>
                <p className="text-xs text-muted-foreground">Review and moderate all open postings.</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 ml-2" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
