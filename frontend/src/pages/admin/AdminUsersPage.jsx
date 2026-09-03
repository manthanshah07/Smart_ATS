import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { UserCog } from 'lucide-react'

export const AdminUsersPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Moderation</h1>
        <p className="text-muted-foreground text-sm">Review, verify, and deactivate candidate and recruiter accounts.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          <UserCog className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>User moderation table and status toggles connect in Phase 7.</p>
        </CardContent>
      </Card>
    </div>
  )
}
