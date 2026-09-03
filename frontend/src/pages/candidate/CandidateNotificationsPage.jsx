import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { notificationService } from '../../services/notificationService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Bell, Check, ExternalLink, Calendar, FileText, Sparkles } from 'lucide-react'

export const CandidateNotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNotifs = async () => {
      setLoading(true)
      try {
        const data = await notificationService.getNotifications('CANDIDATE')
        setNotifications(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadNotifs()
  }, [])

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead('CANDIDATE')
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const handleMarkOneRead = async (id) => {
    await notificationService.markAsRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
  }

  if (loading) return <CardSkeleton />

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notification Center</h1>
          <p className="text-xs text-muted-foreground">
            Real-time updates regarding application stage transitions, interview bookings, and resume parsing.
          </p>
        </div>
        {notifications.some((n) => !n.is_read) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-1.5 text-xs">
            <Check className="h-3.5 w-3.5" /> Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`border-border shadow-2xs transition ${!notif.is_read ? 'border-l-4 border-l-primary bg-primary/5' : 'bg-card'}`}
            >
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{notif.title}</span>
                    {!notif.is_read && <Badge variant="default" className="text-[10px] h-4">New</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-muted-foreground block font-mono pt-1">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!notif.is_read && (
                    <Button variant="ghost" size="sm" onClick={() => handleMarkOneRead(notif.id)} className="text-xs">
                      Mark Read
                    </Button>
                  )}
                  {notif.link_url && (
                    <Link to={notif.link_url}>
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                        View <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications at this time"
          description="You are fully up-to-date with your job applications and interview schedules."
        />
      )}
    </div>
  )
}
