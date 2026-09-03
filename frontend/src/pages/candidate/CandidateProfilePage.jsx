import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { UploadCloud } from 'lucide-react'

export const CandidateProfilePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidate Profile & Resume</h1>
        <p className="text-muted-foreground text-sm">Upload your resume to extract skills, education, and experience.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Resume Processing</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          <UploadCloud className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>Resume drag-and-drop uploader with spaCy skill extraction connects in Phase 3 & 5.</p>
        </CardContent>
      </Card>
    </div>
  )
}
