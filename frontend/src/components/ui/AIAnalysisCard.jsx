import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { Sparkles, CheckCircle2, AlertCircle, TrendingUp, Cpu, HelpCircle, Layers, Clock, AlertTriangle, RefreshCw } from 'lucide-react'
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
      <Card className={cn('border-primary/20 bg-primary/5 animate-pulse', className)}>
        <CardHeader className="pb-3">
          <div className="h-5 w-48 bg-muted rounded mb-2" />
          <div className="h-4 w-64 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-16 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </CardContent>
      </Card>
    )
  }

  // STATE 3: AI analysis unavailable / error
  if (isError) {
    return (
      <Card className={cn('border-destructive/30 bg-destructive/5', className)}>
        <CardContent className="py-8 text-center space-y-3">
          <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-destructive">AI Analysis Unavailable</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
              The explainable matching analysis could not be retrieved at this time.
            </p>
          </div>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5 text-xs">
              <RefreshCw className="h-3 w-3" /> Retry Analysis
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // STATE 1: AI analysis pending
  if (!analysis) {
    return (
      <Card className={cn('border-dashed border-border bg-muted/20', className)}>
        <CardContent className="py-8 text-center space-y-2 text-muted-foreground">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Clock className="h-5 w-5" />
          </div>
          <h4 className="font-semibold text-sm text-foreground">AI Analysis Pending</h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Analysis will appear here once your application has been processed by the sentence transformer matching engine.
          </p>
          <div className="pt-2">
            <Badge variant="outline" className="text-[10px] font-mono bg-background">
              Sentence Transformers (60%) • spaCy (30%) • Exp (10%)
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  // STATE 2: AI analysis available (with explicit Demo/Sample Analysis badge)
  const {
    overall_match_score = 0,
    semantic_similarity_score = 0,
    skill_match_score = 0,
    experience_match_score = 0,
    matched_skills = [],
    missing_skills = [],
    experience_match_summary = '',
    explanation = {},
    model_name = 'all-MiniLM-L6-v2 (Demo Reference)',
  } = analysis

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 60) return 'text-blue-600 dark:text-blue-400'
    if (score >= 40) return 'text-amber-600 dark:text-amber-400'
    return 'text-rose-600 dark:text-rose-400'
  }

  const getProgressBarColor = (score) => {
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-blue-500'
    if (score >= 40) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  return (
    <Card className={cn('border-border/80 shadow-xs bg-card overflow-hidden', className)}>
      {/* Explicit Prototype / Sample Banner */}
      <div className="bg-primary/5 border-b border-primary/20 px-6 py-2 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-primary text-[11px]">
          <Sparkles className="h-3.5 w-3.5" /> Sample / Demo AI Analysis
        </span>
        <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground gap-1 bg-background">
          <Cpu className="h-3 w-3 text-primary" />
          {model_name}
        </Badge>
      </div>

      {/* Header */}
      <div className="px-6 py-3 border-b border-border/60 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-foreground">Explainable Match Breakdown</h4>
          <p className="text-xs text-muted-foreground">
            {role === 'recruiter'
              ? 'Candidate-to-job fit evaluation for recruiter review'
              : 'Multi-factor evaluation breakdown for your submitted resume'}
          </p>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Top Composite Score & Weights Visualizer */}
        <div className="grid sm:grid-cols-12 gap-4 items-center bg-muted/20 p-4 rounded-xl border border-border/50">
          <div className="sm:col-span-4 text-center sm:text-left border-b sm:border-b-0 sm:border-r border-border/60 pb-3 sm:pb-0 sm:pr-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Composite Fit Score
            </span>
            <div className="flex items-baseline justify-center sm:justify-start gap-1 mt-1">
              <span className={cn('text-4xl font-extrabold tracking-tight', getScoreColor(overall_match_score))}>
                {Math.round(overall_match_score)}%
              </span>
              <span className="text-xs text-muted-foreground font-medium">/ 100</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {overall_match_score >= 80
                ? 'Strong alignment with role'
                : overall_match_score >= 60
                ? 'Moderate match'
                : 'Partial match with skill gaps'}
            </p>
          </div>

          {/* 3-Part Component Weights */}
          <div className="sm:col-span-8 space-y-2.5">
            {/* Semantic (60%) */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="flex items-center gap-1 text-foreground">
                  <Layers className="h-3 w-3 text-primary" /> Semantic Vector Similarity (60% weight)
                </span>
                <span className="text-muted-foreground font-mono">{Math.round(semantic_similarity_score)}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', getProgressBarColor(semantic_similarity_score))}
                  style={{ width: `${semantic_similarity_score}%` }}
                />
              </div>
            </div>

            {/* Skill Match (30%) */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="flex items-center gap-1 text-foreground">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Skill Overlap & Extraction (30% weight)
                </span>
                <span className="text-muted-foreground font-mono">{Math.round(skill_match_score)}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', getProgressBarColor(skill_match_score))}
                  style={{ width: `${skill_match_score}%` }}
                />
              </div>
            </div>

            {/* Experience (10%) */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="flex items-center gap-1 text-foreground">
                  <TrendingUp className="h-3 w-3 text-purple-500" /> Experience Alignment (10% weight)
                </span>
                <span className="text-muted-foreground font-mono">{Math.round(experience_match_score)}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', getProgressBarColor(experience_match_score))}
                  style={{ width: `${experience_match_score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Matched vs Missing Skills Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Matched Skills */}
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Matched Core Skills ({matched_skills.length})</span>
            </div>
            {matched_skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matched_skills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="bg-background text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No direct required skill matches extracted.</p>
            )}
          </div>

          {/* Missing Skills */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Missing / Gap Skills ({missing_skills.length})</span>
            </div>
            {missing_skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {missing_skills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="bg-background text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-600 font-medium">All core job required skills verified!</p>
            )}
          </div>
        </div>

        {/* Textual Plain-English Explanation */}
        <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
          <h5 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5 text-primary" /> Evaluation Summary
          </h5>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {explanation?.summary ||
              `Candidate demonstrates strong contextual background with ${matched_skills.length} matching core skills. ${experience_match_summary}`}
          </p>
          {experience_match_summary && (
            <p className="text-[11px] text-muted-foreground/90 font-mono bg-background/80 p-2 rounded border border-border/40">
              Experience fit: {experience_match_summary}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
