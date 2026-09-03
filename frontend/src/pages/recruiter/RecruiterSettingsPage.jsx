import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { CheckCircle2, Bell, Shield, Save } from 'lucide-react'

export const RecruiterSettingsPage = () => {
  const [success, setSuccess] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Recruiter Hiring Settings</h1>
        <p className="text-xs text-muted-foreground">Configure applicant notifications and ranking preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border/60 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Hiring Pipeline Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            {success && (
              <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" /> Preferences saved!
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-input text-primary mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">High AI Match Alert (Match &gt; 85%)</span>
                <span className="text-muted-foreground">Send an immediate high-priority alert when an exceptional candidate applies.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-input text-primary mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">Daily Applicant Digest</span>
                <span className="text-muted-foreground">Receive a summary of all new candidate resumes received across your jobs.</span>
              </div>
            </label>
          </CardContent>
          <CardFooter className="border-t border-border/60 py-3 px-6 flex justify-end">
            <Button type="submit" size="sm" className="gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
