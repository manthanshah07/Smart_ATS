import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format an ISO datetime string to a readable date.
 * e.g. "2026-08-25T14:20:00Z" → "Aug 25, 2026"
 */
export function formatDate(isoString) {
  if (!isoString) return '—'
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return isoString
  }
}

/**
 * Format an ISO datetime string to a readable date + time.
 * e.g. "2026-09-10T15:00:00Z" → "Sep 10, 2026 at 3:00 PM"
 */
export function formatDateTime(isoString) {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    return `${date} at ${time}`
  } catch {
    return isoString
  }
}

/**
 * Return a relative or short date for activity feeds.
 * e.g. "Just now", "Today", "Aug 25"
 */
export function formatRelativeDate(isoString) {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    const now = new Date()
    const diffMs = now - d
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 2) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return isoString
  }
}

/**
 * Extract a display-ready match score from an application object.
 * Applications store score on ai_analysis.overall_match_score.
 */
export function getMatchScoreFromApp(app) {
  return app?.ai_analysis?.overall_match_score ?? null
}

/**
 * Return a label for a numeric match score (0-100).
 * ≥80 = Strong Fit, ≥60 = Moderate Fit, ≥40 = Low Fit, <40 = Weak Fit
 */
export function getMatchLabel(score) {
  if (score == null) return null
  if (score >= 80) return 'Strong Fit'
  if (score >= 60) return 'Moderate Fit'
  if (score >= 40) return 'Low Fit'
  return 'Weak Fit'
}

/**
 * Return Tailwind classes for a match score badge.
 */
export function getMatchBadgeClass(score) {
  if (score == null) return 'bg-muted text-muted-foreground border-border'
  if (score >= 80) return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
  if (score >= 60) return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
  if (score >= 40) return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
  return 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
}

