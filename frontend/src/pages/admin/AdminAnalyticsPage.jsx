import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { BarChart3, TrendingUp, Users, Briefcase, Sparkles, Layers } from 'lucide-react'

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Platform Analytics & Growth Trends</h1>
        <p className="text-xs text-muted-foreground">Historical volume trends, skill demand curves, and NLP pipeline metrics.</p>
      </div>

      {/* Monthly Platform Trajectory Table / Visualizer */}
      <Card className="border-border shadow-xs">
        <CardHeader className="border-b border-border/60 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Month-over-Month Growth (2026)
          </CardTitle>
          <CardDescription className="text-xs">Aggregate applications, new job postings, and user registrations.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-5 gap-4">
            {monthly_growth.map((item) => (
              <div key={item.month} className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-2">
                <span className="text-xs font-bold text-foreground block">{item.month}</span>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Applications:</span>
                    <strong className="text-primary font-mono">{item.applications}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jobs Posted:</span>
                    <strong className="text-foreground font-mono">{item.jobs}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Users:</span>
                    <strong className="text-foreground font-mono">{item.users}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill Demand vs Funnel */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Demanded Skills */}
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border/60 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Most Demanded Technical Skills
            </CardTitle>
            <CardDescription className="text-xs">Frequency of required skills extracted across all job descriptions.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {top_demanded_skills.map((skill) => (
              <div key={skill.name} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/50 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{skill.name}</span>
                  <Badge variant="outline" className="text-[10px] bg-background">
                    {skill.category}
                  </Badge>
                </div>
                <span className="font-mono font-bold text-primary">{skill.count} Postings</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Hiring Funnel */}
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border/60 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-600" /> End-to-End Recruitment Funnel
            </CardTitle>
            <CardDescription className="text-xs">Candidate conversion rates through each stage.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {hiring_funnel.map((step, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">{step.stage}</span>
                  <span className="text-muted-foreground font-mono">{step.count} ({step.conversion})</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: step.conversion }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
