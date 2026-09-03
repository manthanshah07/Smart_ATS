import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { PlusCircle } from 'lucide-react'

export const RecruiterJobsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Openings Management</h1>
        <p className="text-muted-foreground text-sm">Create, edit, pause, and close job postings for your organization.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Company Postings</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          <PlusCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>Job creation forms, status toggles, and criteria editing connect in Phase 4.</p>
        </CardContent>
      </Card>
    </div>
  )
}
