import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Award } from 'lucide-react'

export const RecruiterApplicantsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI-Ranked Applicants</h1>
        <p className="text-muted-foreground text-sm">Review candidate match percentages, matched/missing skill tags, and schedule interviews.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Applicant Evaluation Queue</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Award className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>AI-ranked candidate table, shortlist/reject actions, and interview modal connect in Phase 6.</p>
        </CardContent>
      </Card>
    </div>
  )
}
