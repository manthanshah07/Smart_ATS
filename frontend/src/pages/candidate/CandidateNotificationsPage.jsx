import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { notificationService } from '../../services/notificationService'
import { Button } from '../../components/ui/button'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Check, ExternalLink } from 'lucide-react'

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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Notification Feed
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Stage updates, interview invitations, and resume processing receipts.
          </p>
        </div>
        {notifications.some((n) => !n.is_read) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="text-xs h-8 gap-1.5">
            <Check className="h-3.5 w-3.5" /> Mark All Read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg border text-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !notif.is_read
                  ? 'bg-card border-foreground/30 ring-1 ring-foreground/5'
                  : 'bg-card border-border'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{notif.title}</span>
                  {!notif.is_read && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">{notif.message}</p>
                <span className="text-[11px] text-muted-foreground block pt-0.5">
                  {new Date(notif.created_at).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!notif.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkOneRead(notif.id)}
                    className="text-xs h-7 px-2"
                  >
                    Mark Read
                  </Button>
                )}
                {notif.link_url && (
                  <Link to={notif.link_url}>
                    <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 gap-1">
                      View <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No notifications"
          description="You are fully up to date with your applications and interview schedules."
        />
      )}
    </div>
  )
}
