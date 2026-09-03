import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export const Modal = ({ isOpen, onClose, title, description, children, footer, size = 'default' }) => {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        className={cn(
          'relative z-50 w-full rounded-xl border bg-background p-6 shadow-2xl transition-all animate-in zoom-in-95 max-h-[90vh] flex flex-col',
          sizeClasses[size] || sizeClasses.default
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border/60">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Body (scrollable if long) */}
        <div className="flex-1 overflow-y-auto py-4 text-sm">{children}</div>

        {/* Footer */}
        {footer && <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
