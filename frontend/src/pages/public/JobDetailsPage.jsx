import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/card'

export const JobDetailsPage = () => {
  const { id } = useParams()
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Job Specification #{id}</h1>
      <Card>
        <CardContent className="py-8 text-muted-foreground">
          Detailed job descriptions and application submission modal will activate in Phase 3 & 6.
        </CardContent>
      </Card>
    </div>
  )
}
