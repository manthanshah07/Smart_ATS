import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Sparkles, ShieldCheck, Zap, LineChart, CheckCircle2, ArrowRight } from 'lucide-react'

export const LandingPage = () => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Explainable AI-Powered Applicant Tracking</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Smarter Hiring, <span className="text-primary">Transparent Match Scores.</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          SmartATS extracts skills from resumes, performs deterministic semantic vector matching, and ranks applicants with total explainability.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/jobs">
            <Button size="lg" className="gap-2">
              Browse Open Jobs <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
              <Zap className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Semantic Matching</CardTitle>
            <CardDescription>
              Dense 384-dim embeddings calculate cosine similarity between resumes and job descriptions (60% weight).
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Matched & Missing Skills</CardTitle>
            <CardDescription>
              spaCy NLP entity extraction identifies exact skill overlaps and gaps so recruiters know precisely why a candidate matches.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-2">
              <LineChart className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Ranked Pipeline</CardTitle>
            <CardDescription>
              Recruiters receive pre-ranked candidate queues with status progression and interview coordination.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  )
}
