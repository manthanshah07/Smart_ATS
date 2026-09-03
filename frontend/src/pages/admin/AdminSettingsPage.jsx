import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { CheckCircle2, Cpu, Save, Info, Sliders } from 'lucide-react'

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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">System Configuration & Governance</h1>
        <p className="text-xs text-muted-foreground">Review planned AI scoring architecture parameters and platform security toggles.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border/60 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-primary" /> Configured AI Scoring Architecture Weights
              </CardTitle>
              <CardDescription className="text-xs">
                Specification weights locking the multi-factor evaluation pipeline.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono bg-background">
              Architecture Spec
            </Badge>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            {success && (
              <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" /> Prototype configuration preferences saved!
              </div>
            )}

            <div className="rounded-lg bg-muted/40 border border-border p-3 text-xs text-muted-foreground flex items-start gap-2">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                These scoring weights represent the locked mathematical formula (Semantic 60% + Skills 30% + Experience 10%). They will govern the Sentence Transformers pipeline when backend AI services are integrated.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
              <div className="flex items-center justify-between font-semibold text-foreground">
                <div className="space-y-0.5">
                  <span className="block">Semantic Similarity Weight</span>
                  <span className="text-[11px] text-muted-foreground font-normal">384-dimensional Sentence Transformer vector cosine similarity</span>
                </div>
                <span className="font-mono text-sm font-bold text-primary">60%</span>
              </div>

              <div className="flex items-center justify-between font-semibold text-foreground pt-2 border-t border-border/40">
                <div className="space-y-0.5">
                  <span className="block">Skill Taxonomy Overlap Weight</span>
                  <span className="text-[11px] text-muted-foreground font-normal">spaCy entity extraction and exact/fuzzy taxonomy matching</span>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-600">30%</span>
              </div>

              <div className="flex items-center justify-between font-semibold text-foreground pt-2 border-t border-border/40">
                <div className="space-y-0.5">
                  <span className="block">Experience Alignment Weight</span>
                  <span className="text-[11px] text-muted-foreground font-normal">Demonstrated years of experience vs required threshold</span>
                </div>
                <span className="font-mono text-sm font-bold text-purple-600">10%</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-input text-primary mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block">Resume Formatting Verification</span>
                  <span className="text-muted-foreground">Validate extracted entity structures before passing to vector similarity stage.</span>
                </div>
              </label>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/60 py-3 px-6 flex justify-end">
            <Button type="submit" size="sm" className="gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
