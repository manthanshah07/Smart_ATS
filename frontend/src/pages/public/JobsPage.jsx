import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Briefcase } from 'lucide-react'

export const JobsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Explore Job Openings</h1>
        <p className="text-muted-foreground text-sm">Discover positions matched against your resume profile.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>Job listings and search filters will be connected in Phase 3 & 4.</p>
        </CardContent>
      </Card>
    </div>
  )
}
