import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { FileSearch } from 'lucide-react'

export const CandidateApplicationsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Application Tracker</h1>
        <p className="text-muted-foreground text-sm">Monitor recruitment stages, AI match breakdowns, and interview schedules.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Submitted Applications</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          <FileSearch className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>Application lifecycle tracker with state progress visualization connects in Phase 6.</p>
        </CardContent>
      </Card>
    </div>
  )
}
