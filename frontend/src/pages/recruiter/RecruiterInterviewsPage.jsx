import React, { useState, useEffect } from 'react'
import { interviewService } from '../../services/interviewService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Calendar, Video, Clock, User, Plus, ExternalLink } from 'lucide-react'

export const RecruiterInterviewsPage = () => {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInterviews = async () => {
      setLoading(true)
      try {
        const data = await interviewService.getInterviews()
        setInterviews(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadInterviews()
  }, [])

  if (loading) return <CardSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Interview Schedules & Pipeline</h1>
          <p className="text-xs text-muted-foreground">
            Manage upcoming technical and HR screening rounds with shortlisted applicants.
          </p>
        </div>
      </div>

      {interviews.length > 0 ? (
        <div className="space-y-4">
          {interviews.map((item) => (
            <Card key={item.id} className="border-border shadow-xs overflow-hidden">
              <div className="p-5 bg-muted/20 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">{item.candidate_name}</h3>
                    <StatusBadge type="interview" status={item.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Role: <strong className="text-foreground">{item.job_title}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a href={item.meeting_link_or_location} target="_blank" rel="noreferrer">
                    <Button size="sm" className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs">
                      <Video className="h-3.5 w-3.5" /> Launch Video Call
                    </Button>
                  </a>
                </div>
              </div>

              <CardContent className="p-5 space-y-3">
                <div className="grid sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-muted-foreground uppercase text-[10px] font-bold block mb-1">Time</span>
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {new Date(item.scheduled_time).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-muted-foreground uppercase text-[10px] font-bold block mb-1">Type</span>
                    <span className="font-bold text-foreground">{item.interview_type} ({item.duration_minutes} Mins)</span>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-muted-foreground uppercase text-[10px] font-bold block mb-1">Interviewer(s)</span>
                    <span className="font-bold text-foreground">{item.interviewer_name}</span>
                  </div>
                </div>

                {item.preparation_notes && (
                  <div className="text-xs p-3 rounded-lg bg-muted/40 border border-border/60 text-muted-foreground">
                    <strong className="text-foreground block mb-0.5">Notes:</strong>
                    {item.preparation_notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled"
          description="Schedule interviews directly from applicant review detail cards."
        />
      )}
    </div>
  )
}
