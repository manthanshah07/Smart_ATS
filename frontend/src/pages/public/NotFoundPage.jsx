import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { FileQuestion, ArrowLeft } from 'lucide-react'

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
      <div className="h-12 w-12 rounded-lg bg-muted text-muted-foreground flex items-center justify-center mb-1">
        <FileQuestion className="h-6 w-6" />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-foreground">Page Not Found</h1>
      <p className="text-xs text-muted-foreground leading-relaxed">
        The requested resource, job posting, or dashboard page could not be located.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button size="sm" className="text-xs h-8 gap-1.5 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> Return to SmartATS Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
