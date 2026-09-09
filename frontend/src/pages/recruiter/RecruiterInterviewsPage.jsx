import React, { useState, useEffect } from 'react'
import { interviewService } from '../../services/interviewService'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Calendar, Video, Clock, User } from 'lucide-react'

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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-border pb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Interview Schedule & Rounds
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Upcoming technical assessments, cultural rounds, and video conference links with shortlisted candidates.
        </p>
      </div>

      {interviews.length === 0 ? (
        <EmptyState
          title="No interviews currently scheduled"
          description="Schedule interviews directly from applicant review detail dossiers."
          actionText="View Pipeline"
          onAction={() => window.location.assign('/recruiter/applicants')}
        />
      ) : (
        <div className="space-y-4">
          {interviews.map((item) => (
            <div key={item.id} className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="p-5 bg-muted/20 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">{item.candidate_name}</h3>
                    <StatusBadge type="interview" status={item.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Position: <strong className="text-foreground">{item.job_title}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a href={item.meeting_link_or_location} target="_blank" rel="noreferrer">
                    <Button size="sm" className="text-xs h-8 gap-1.5 font-medium">
                      <Video className="h-3.5 w-3.5" /> Launch Video Call
                    </Button>
                  </a>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded bg-muted/30 border border-border">
                    <span className="text-muted-foreground text-[10px] uppercase font-semibold block mb-0.5">
                      Scheduled Time
                    </span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {new Date(item.scheduled_time).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 rounded bg-muted/30 border border-border">
                    <span className="text-muted-foreground text-[10px] uppercase font-semibold block mb-0.5">
                      Round Format
                    </span>
                    <span className="font-semibold text-foreground">
                      {item.interview_type} ({item.duration_minutes} Mins)
                    </span>
                  </div>

                  <div className="p-3 rounded bg-muted/30 border border-border">
                    <span className="text-muted-foreground text-[10px] uppercase font-semibold block mb-0.5">
                      Interviewer
                    </span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {item.interviewer_name}
                    </span>
                  </div>
                </div>

                {item.preparation_notes && (
                  <div className="text-xs p-3 rounded bg-muted/20 border border-border text-foreground">
                    <span className="font-semibold block mb-1">Preparation Guidance:</span>
                    <span className="text-muted-foreground leading-relaxed">{item.preparation_notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
