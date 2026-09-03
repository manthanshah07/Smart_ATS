import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { CheckCircle2, ShieldAlert, Cpu, Save } from 'lucide-react'

export const AdminSettingsPage = () => {
  const [success, setSuccess] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">System Governance Settings</h1>
        <p className="text-xs text-muted-foreground">Global AI pipeline thresholds and security moderation toggles.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border/60 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" /> AI Match Engine Weights & Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            {success && (
              <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" /> System parameters updated!
              </div>
            )}

            <div className="p-3.5 rounded-lg bg-muted/30 border border-border/60 space-y-2">
              <div className="flex justify-between font-semibold text-foreground">
                <span>Semantic Similarity Weight (Fixed Architecture)</span>
                <span className="font-mono">60%</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground">
                <span>Skill Taxonomy Overlap Weight (Fixed Architecture)</span>
                <span className="font-mono">30%</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground">
                <span>Experience Alignment Weight (Fixed Architecture)</span>
                <span className="font-mono">10%</span>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input type="checkbox" defaultChecked className="rounded border-input text-primary mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">Auto-Flag Suspicious Resumes</span>
                <span className="text-muted-foreground">Automatically flag resumes with keyword stuffing or unverified entity formatting.</span>
              </div>
            </label>
          </CardContent>
          <CardFooter className="border-t border-border/60 py-3 px-6 flex justify-end">
            <Button type="submit" size="sm" className="gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save Parameters
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
