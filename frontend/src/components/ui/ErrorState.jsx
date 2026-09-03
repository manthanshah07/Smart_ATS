import React from 'react'
import { Button } from './button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '../../lib/utils'

export const ErrorState = ({
  title = 'Failed to load content',
  message = 'An error occurred while fetching information. Please try again.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center flex flex-col items-center justify-center',
        className
      )}
    >
      <div className="h-10 w-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center mb-2">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-destructive">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-xs mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 border-destructive/30 hover:bg-destructive/10">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Request
        </Button>
      )}
    </div>
  )
}
