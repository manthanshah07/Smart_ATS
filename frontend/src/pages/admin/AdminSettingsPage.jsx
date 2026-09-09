import React, { useState } from 'react'
import { Button } from '../../components/ui/button'
import { CheckCircle2, Save, SlidersHorizontal, Info } from 'lucide-react'

export const AdminSettingsPage = () => {
  const [success, setSuccess] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-border pb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          System Parameters & Algorithm Calibration
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Review locked mathematical weights governing the candidate qualification and ranking engine.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Configured AI Scoring Weights (Locked 60 / 30 / 10 Architecture)
            </h2>
            <span className="text-[10px] font-mono uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded">
              Deterministic Spec
            </span>
          </div>

          {success && (
            <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>System preferences saved.</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded bg-muted/20 border border-border space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Semantic Similarity Factor</span>
                <span className="font-bold text-foreground font-mono">60%</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Cosine similarity across 384-dimensional sentence transformer embeddings (<code className="font-mono text-[10px]">all-MiniLM-L6-v2</code>).
              </p>
            </div>

            <div className="p-3.5 rounded bg-muted/20 border border-border space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Skill Overlap Factor</span>
                <span className="font-bold text-foreground font-mono">30%</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Jaccard overlap between spaCy-extracted candidate skills and role required competencies.
              </p>
            </div>

            <div className="p-3.5 rounded bg-muted/20 border border-border space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Experience Seniority Factor</span>
                <span className="font-bold text-foreground font-mono">10%</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Seniority threshold delta calculated from candidate career history vs minimum requirement.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="sm" className="text-xs h-9 px-5 gap-1.5 font-medium">
            <Save className="h-3.5 w-3.5" /> Save Configuration
          </Button>
        </div>
      </form>
    </div>
  )
}
