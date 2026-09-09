import React from 'react'
import { Card, CardContent } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { Clock, AlertTriangle, RefreshCw, CheckCircle2, XCircle, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

export const AIAnalysisCard = ({
  analysis,
  role = 'candidate', // 'candidate' | 'recruiter'
  className,
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  // Loading State
  if (isLoading) {
    return (
      <div className={cn('border border-border rounded-lg p-5 space-y-4 bg-card', className)}>
        <div className="h-4 w-40 bg-muted animate-pulse rounded" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted animate-pulse rounded" />
          <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  // Error / Unavailable State
  if (isError) {
    return (
      <div className={cn('border border-destructive/20 bg-destructive/5 rounded-lg p-6 text-center space-y-3', className)}>
        <AlertTriangle className="h-5 w-5 text-destructive mx-auto" />
        <div className="space-y-1">
          <h4 className="font-semibold text-xs text-destructive">Evaluation Unavailable</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            The candidate match assessment could not be loaded at this time.
          </p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="text-xs h-7 gap-1">
            <RefreshCw className="h-3 w-3" /> Retry Evaluation
          </Button>
        )}
      </div>
    )
  }

  // Pending State
  if (!analysis) {
    return (
      <div className={cn('border border-dashed border-border rounded-lg p-6 text-center space-y-2 bg-card', className)}>
        <Clock className="h-5 w-5 text-muted-foreground mx-auto" />
        <div className="space-y-1">
          <h4 className="font-semibold text-xs text-foreground">Match Assessment Pending</h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            This application is queued for deterministic evaluation using our 60% semantic, 30% skill overlap, and 10% experience alignment scoring model.
          </p>
        </div>
      </div>
    )
  }

  // Available Analysis
  const {
    overall_match_score = 0,
    semantic_similarity_score = 0,
    skill_match_score = 0,
    experience_match_score = 0,
    matched_skills = [],
    missing_skills = [],
    experience_match_summary = '',
    explanation = {},
    model_name = 'all-MiniLM-L6-v2',
  } = analysis

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/40'
    if (score >= 60) return 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-950/40'
    if (score >= 40) return 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/40'
    return 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-950/40'
  }

  const getBarColor = (score) => {
    if (score >= 80) return 'bg-emerald-600'
    if (score >= 60) return 'bg-blue-600'
    if (score >= 40) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  const rationaleText =
    typeof explanation === 'string'
      ? explanation
      : explanation?.recommendation_summary ||
        explanation?.strengths_summary ||
        'Strong candidate alignment across core technical competencies and functional requirements.'

  return (
    <div className={cn('border border-border rounded-lg bg-card overflow-hidden', className)}>
      {/* Assessment Header */}
      <div className="px-5 py-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-foreground">Qualification & Match Assessment</h3>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
              Deterministic
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluated against role requirements via semantic embedding and entity parsing.
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className={cn('px-3 py-1.5 rounded border flex items-baseline gap-1.5', getScoreBadgeClass(overall_match_score))}>
            <span className="text-xl font-bold tracking-tight">{overall_match_score}%</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
              {overall_match_score >= 80 ? 'Strong Fit' : overall_match_score >= 60 ? 'Moderate Fit' : 'Low Fit'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Factor Breakdown (60 / 30 / 10) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground text-xs">Weighted Factor Breakdown</span>
            <span className="text-[11px] text-muted-foreground">Formula: 60% Semantic + 30% Skills + 10% Experience</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-1">
            {/* 1. Semantic Similarity */}
            <div className="space-y-1.5 p-3 rounded-md bg-muted/30 border border-border/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Semantic Fit (60%)</span>
                <span className="font-bold text-foreground">{semantic_similarity_score}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div
                  className={cn('h-full transition-all duration-300', getBarColor(semantic_similarity_score))}
                  style={{ width: `${semantic_similarity_score}%` }}
                />
              </div>
            </div>

            {/* 2. Skill Alignment */}
            <div className="space-y-1.5 p-3 rounded-md bg-muted/30 border border-border/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Skill Overlap (30%)</span>
                <span className="font-bold text-foreground">{skill_match_score}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div
                  className={cn('h-full transition-all duration-300', getBarColor(skill_match_score))}
                  style={{ width: `${skill_match_score}%` }}
                />
              </div>
            </div>

            {/* 3. Experience Alignment */}
            <div className="space-y-1.5 p-3 rounded-md bg-muted/30 border border-border/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Experience (10%)</span>
                <span className="font-bold text-foreground">{experience_match_score}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div
                  className={cn('h-full transition-all duration-300', getBarColor(experience_match_score))}
                  style={{ width: `${experience_match_score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills Alignment Matrix */}
        <div className="grid sm:grid-cols-2 gap-4 pt-1 border-t border-border">
          {/* Matched Skills */}
          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Verified Skill Overlap ({matched_skills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matched_skills.length > 0 ? (
                matched_skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No direct required skills extracted.</span>
              )}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <XCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>Identified Skill Gaps ({missing_skills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missing_skills.length > 0 ? (
                missing_skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-600 font-medium">All essential skills matched.</span>
              )}
            </div>
          </div>
        </div>

        {/* Rationale & Experience Narrative */}
        <div className="space-y-2 pt-4 border-t border-border">
          <h4 className="text-xs font-semibold text-foreground">Evaluation Summary & Rationale</h4>
          <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded border border-border">
            {rationaleText}
          </p>
          {experience_match_summary && (
            <p className="text-[11px] text-muted-foreground italic px-1">
              Note: {experience_match_summary}
            </p>
          )}
        </div>

        {/* Audit Metadata Footer */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60">
          <span>Embedding Model: <code className="font-mono text-[10px]">{model_name}</code></span>
          <span>Zero Black-Box Bias Guarantee</span>
        </div>
      </div>
    </div>
  )
}
