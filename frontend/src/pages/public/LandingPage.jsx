import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  Users,
  ShieldCheck,
  TrendingUp,
  Cpu,
  ChevronRight,
  Search,
} from 'lucide-react'

export const LandingPage = () => {
  return (
    <div className="space-y-24 py-6">
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 max-w-4xl mx-auto px-4 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-2xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Explainable AI-Powered Applicant Tracking System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          Find the Right Opportunity. <br className="hidden sm:inline" />
          <span className="text-primary">Hire with Total Explainability.</span>
        </h1>

        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          SmartATS extracts skills from resumes, generates 384-dimensional dense semantic embeddings, and ranks applicants with transparent, deterministic scoring.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/jobs">
            <Button size="lg" className="gap-2 h-11 px-6 shadow-md">
              Browse Open Positions <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg" className="h-11 px-6">
              Create Free Account
            </Button>
          </Link>
        </div>

        {/* Hero Interactive AI Preview Card */}
        <div className="pt-8 text-left max-w-2xl mx-auto">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/10 rounded-bl-full pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-border/70">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  JD
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Jane Doe &rarr; Full-Stack Python/React</h4>
                  <p className="text-xs text-muted-foreground">TechPulse AI • San Francisco, CA</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">91.5%</div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">AI Match Score</p>
              </div>
            </div>

            <div className="py-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-muted/40 border border-border/40">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Semantic (60%)</span>
                  <span className="font-bold text-foreground">93.0%</span>
                </div>
                <div className="p-2 rounded-lg bg-muted/40 border border-border/40">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Skills (30%)</span>
                  <span className="font-bold text-foreground">91.0%</span>
                </div>
                <div className="p-2 rounded-lg bg-muted/40 border border-border/40">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Experience (10%)</span>
                  <span className="font-bold text-foreground">85.0%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">Matched Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {['Python', 'Django', 'React', 'PostgreSQL', 'Docker', 'REST APIs'].map((s) => (
                    <Badge key={s} variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[11px]">
                      {s}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-[11px]">
                    Missing: Kubernetes
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-primary" /> Model: Sentence Transformers (all-MiniLM-L6-v2)
              </span>
              <span className="text-emerald-600 font-medium">Explainable Result Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW SMARTATS WORKS */}
      <section className="container max-w-6xl mx-auto space-y-12 px-4">
        <div className="text-center space-y-3">
          <Badge variant="outline" className="text-xs uppercase font-mono">Pipeline Architecture</Badge>
          <h2 className="text-3xl font-bold tracking-tight">How Explainable Matching Operates</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            From raw resume document parsing to multi-dimensional vector similarity calculations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-6">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3 font-bold">
                1
              </div>
              <CardTitle className="text-base">Document Parsing</CardTitle>
              <CardDescription className="text-xs leading-relaxed mt-2">
                Extracts clean text streams from uploaded PDF and DOCX files with size and structure validation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border shadow-xs">
            <CardHeader className="p-6">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center mb-3 font-bold">
                2
              </div>
              <CardTitle className="text-base">NLP Extraction</CardTitle>
              <CardDescription className="text-xs leading-relaxed mt-2">
                spaCy entity recognition maps skills, degrees, and work durations against standardized taxonomies.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border shadow-xs">
            <CardHeader className="p-6">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3 font-bold">
                3
              </div>
              <CardTitle className="text-base">Vector Encoding</CardTitle>
              <CardDescription className="text-xs leading-relaxed mt-2">
                Sentence Transformers encode normalized representations into 384-dimensional dense vectors.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border shadow-xs">
            <CardHeader className="p-6">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3 font-bold">
                4
              </div>
              <CardTitle className="text-base">Explainable Scoring</CardTitle>
              <CardDescription className="text-xs leading-relaxed mt-2">
                Computes cosine similarity (60%), skill overlap (30%), and experience fit (10%) with explicit gap tags.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 3. CANDIDATE & RECRUITER VALUE PROPOSITIONS */}
      <section className="container max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-4">
        {/* Candidate Box */}
        <div className="rounded-2xl border border-border bg-card p-8 space-y-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600">
            <Users className="h-4 w-4" /> For Job Seekers
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Know Exactly Where You Stand</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No more opaque ATS black-boxes. See your match score broken down into semantic alignment, recognized skills, and missing requirements before and after applying.
          </p>
          <ul className="space-y-3 text-xs text-foreground font-medium">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Instant feedback on missing skills to improve your resume.</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Real-time lifecycle tracking across all application stages.</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Direct interview calendar invitations and preparation notes.</span>
            </li>
          </ul>
          <Link to="/jobs" className="inline-block pt-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              Explore Open Jobs <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Recruiter Box */}
        <div className="rounded-2xl border border-border bg-card p-8 space-y-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-lg bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600">
            <TrendingUp className="h-4 w-4" /> For Hiring Teams
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Pre-Ranked, Qualified Applicant Queues</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Save dozens of hours screening hundreds of resumes. Let our deterministic NLP model surface the strongest candidates ranked by genuine skill and experience relevance.
          </p>
          <ul className="space-y-3 text-xs text-foreground font-medium">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Automatic AI applicant ranking sorted by composite match score.</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>One-click shortlist/reject actions with candidate notifications.</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Structured interview scheduling with meeting links and feedback logs.</span>
            </li>
          </ul>
          <Link to="/register" className="inline-block pt-2">
            <Button size="sm" className="gap-1.5">
              Start Hiring on SmartATS <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="container max-w-4xl mx-auto text-center bg-primary text-primary-foreground p-12 rounded-3xl space-y-6 shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Ready to Experience Transparent Hiring?
        </h2>
        <p className="text-primary-foreground/90 max-w-xl mx-auto text-sm leading-relaxed">
          Join thousands of candidates and forward-thinking recruiters leveraging explainable AI recruitment.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/register">
            <Button size="lg" variant="secondary" className="font-bold shadow-sm">
              Get Started Now
            </Button>
          </Link>
          <Link to="/jobs">
            <Button size="lg" variant="outline" className="bg-primary/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary/30">
              Browse Open Jobs
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
