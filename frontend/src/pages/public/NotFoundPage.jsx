import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { FileQuestion, ArrowLeft } from 'lucide-react'

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
      <div className="h-16 w-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mb-2">
        <FileQuestion className="h-8 w-8 opacity-70" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Page Not Found</h1>
      <p className="text-xs text-muted-foreground leading-relaxed">
        The requested resource, job posting, or dashboard page could not be located.
      </p>
      <div className="pt-4">
        <Link to="/">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Return to SmartATS Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
