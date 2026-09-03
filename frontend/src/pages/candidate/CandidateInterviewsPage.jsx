import React, { useState, useEffect } from 'react'
import { interviewService } from '../../services/interviewService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Calendar, Video, Clock, Building, User, FileText, CheckCircle2 } from 'lucide-react'

export const CandidateInterviewsPage = () => {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInterviews = async () => {
      setLoading(true)
      try {
        const data = await interviewService.getInterviews({ candidate_id: 101 })
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Scheduled Interviews</h1>
        <p className="text-xs text-muted-foreground">
          View your upcoming technical screenings, interview preparation notes, and video conference links.
        </p>
      </div>

      {interviews.length > 0 ? (
        <div className="space-y-4">
          {interviews.map((item) => (
            <Card key={item.id} className="border-border shadow-xs overflow-hidden">
              <div className="p-5 bg-muted/20 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">{item.job_title}</h3>
                    <StatusBadge type="interview" status={item.status} />
                  </div>
                  <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                    <Building className="h-3.5 w-3.5" /> {item.company_name}
                  </p>
                </div>

                {item.status === 'SCHEDULED' && (
                  <a href={item.meeting_link_or_location} target="_blank" rel="noreferrer">
                    <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-xs">
                      <Video className="h-3.5 w-3.5" /> Join Video Call
                    </Button>
                  </a>
                )}
              </div>

              <CardContent className="p-5 space-y-4">
                <div className="grid sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-muted-foreground uppercase text-[10px] font-bold block mb-1">Date & Time</span>
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {new Date(item.scheduled_time).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-muted-foreground uppercase text-[10px] font-bold block mb-1">Round Format</span>
                    <span className="font-bold text-foreground">{item.interview_type} ({item.duration_minutes} Mins)</span>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-muted-foreground uppercase text-[10px] font-bold block mb-1">Interviewer(s)</span>
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" />
                      {item.interviewer_name}
                    </span>
                  </div>
                </div>

                {item.preparation_notes && (
                  <div className="text-xs p-3.5 rounded-lg bg-blue-500/5 border border-blue-500/20 text-blue-900 dark:text-blue-200">
                    <strong className="block mb-1 text-[11px] uppercase tracking-wider text-blue-700 dark:text-blue-400">
                      Preparation Guidance:
                    </strong>
                    {item.preparation_notes}
                  </div>
                )}

                {item.feedback && (
                  <div className="text-xs p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
                    <strong className="block mb-1 text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Interviewer Feedback:
                    </strong>
                    {item.feedback}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled yet"
          description="When recruiters shortlist your application and book a screening round, details and video links will appear here."
        />
      )}
    </div>
  )
}
