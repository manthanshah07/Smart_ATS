import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Briefcase,
  Users,
  Layers,
  ShieldCheck,
  Search,
  FileText,
  SlidersHorizontal,
} from 'lucide-react'

export const LandingPage = () => {
  return (
    <div className="space-y-24 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HERO SECTION: Editorial 2-Column with Realistic Product Preview */}
      <section className="pt-6 pb-12 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Direct Product Copy & CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-border bg-muted/40 text-xs font-medium text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            Deterministic Candidate-to-Job Matching
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            Hiring decisions backed by explainable relevance.
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed">
            SmartATS replaces unexplainable black-box screening with transparent candidate evaluation. Resumes are parsed into verified skills and dense semantic vectors, delivering honest match scores with full breakdown.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/jobs">
              <Button size="lg" className="h-10 px-5 text-xs font-medium gap-2">
                Explore Open Roles <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="h-10 px-5 text-xs font-medium">
                Create Account
              </Button>
            </Link>
          </div>

          {/* Value Micro-Points */}
          <div className="pt-4 border-t border-border grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="font-semibold text-foreground block">60 / 30 / 10 Formula</span>
              <span className="text-muted-foreground text-[11px]">Semantic, skills & experience</span>
            </div>
            <div>
              <span className="font-semibold text-foreground block">Zero Bias Engine</span>
              <span className="text-muted-foreground text-[11px]">Strictly skill-grounded</span>
            </div>
            <div>
              <span className="font-semibold text-foreground block">Recruiter Triage</span>
              <span className="text-muted-foreground text-[11px]">Ranked candidate queues</span>
            </div>
          </div>
        </div>

        {/* Right Column: Realistic Product UI Preview */}
        <div className="lg:col-span-6">
          <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden text-left">
            {/* UI Window Header */}
            <div className="px-4 py-3 bg-muted/30 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="ml-2 text-xs font-medium text-muted-foreground">Application Qualification Dossier</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                87% Match • Strong Fit
              </span>
            </div>

            {/* Candidate & Role Snapshot */}
            <div className="p-5 border-b border-border space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Jane Doe &rarr; Senior Backend Engineer</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Applied to TechPulse AI • 4.5 Yrs Experience</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-muted-foreground">all-MiniLM-L6-v2</span>
                </div>
              </div>

              {/* Formula Bar */}
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div className="p-2 rounded bg-muted/30 border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-medium block">Semantic (60%)</span>
                  <span className="font-bold text-foreground">91%</span>
                </div>
                <div className="p-2 rounded bg-muted/30 border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-medium block">Skills (30%)</span>
                  <span className="font-bold text-foreground">82%</span>
                </div>
                <div className="p-2 rounded bg-muted/30 border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-medium block">Experience (10%)</span>
                  <span className="font-bold text-foreground">78%</span>
                </div>
              </div>
            </div>

            {/* Skills Matrix */}
            <div className="p-5 space-y-4">
              <div>
                <span className="text-xs font-semibold text-foreground block mb-2">Verified Skill Alignment:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Python', 'Django', 'REST APIs', 'PostgreSQL', 'Docker'].map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                      {s}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                    Gap: Kubernetes
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <span className="text-xs font-semibold text-foreground block mb-1">Assessment Rationale:</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Candidate demonstrates comprehensive mastery in Python/Django backend systems with production PostgreSQL database optimization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS: Numbered 5-Step Process */}
      <section id="how-it-works" className="py-12 border-t border-border space-y-12">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">The Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            How SmartATS matches talent and opportunities
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            A continuous, transparent hiring loop designed for candidates seeking clarity and recruiters requiring rigor.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="space-y-3 p-4 rounded-lg bg-card border border-border">
            <span className="font-mono text-xs font-bold text-muted-foreground">01</span>
            <h3 className="font-semibold text-sm text-foreground">Upload Resume</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload PDF or DOCX format. spaCy extracts skills, work history, and education entities.
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-card border border-border">
            <span className="font-mono text-xs font-bold text-muted-foreground">02</span>
            <h3 className="font-semibold text-sm text-foreground">Explore Roles</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Search verified job openings across engineering, product, and leadership with full requirements.
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-card border border-border">
            <span className="font-mono text-xs font-bold text-muted-foreground">03</span>
            <h3 className="font-semibold text-sm text-foreground">Submit Application</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Apply in one click using your parsed profile snapshot and verified skill baseline.
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-card border border-border">
            <span className="font-mono text-xs font-bold text-muted-foreground">04</span>
            <h3 className="font-semibold text-sm text-foreground">AI Evaluation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sentence transformers calculate cosine similarity, skill overlap, and experience alignment.
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-card border border-border">
            <span className="font-mono text-xs font-bold text-muted-foreground">05</span>
            <h3 className="font-semibold text-sm text-foreground">Recruiter Review</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Recruiters triage applicants by composite match score, inspect skill gaps, and schedule interviews.
            </p>
          </div>
        </div>
      </section>

      {/* 3. EXPLAINABLE AI ARCHITECTURE SECTION */}
      <section id="architecture" className="py-12 border-t border-border grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Evaluation Engine</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            The 60 / 30 / 10 scoring formula
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Unlike generative AI tools that hallucinate ratings, SmartATS applies a deterministic mathematical composite score. Both candidates and recruiters see the exact formula behind every match.
          </p>

          <div className="pt-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 rounded bg-muted items-center justify-center text-xs font-bold text-foreground shrink-0 mt-0.5">
                60%
              </span>
              <div>
                <h4 className="text-xs font-semibold text-foreground">Semantic Similarity</h4>
                <p className="text-xs text-muted-foreground">
                  Dense cosine similarity between resume text and job description embeddings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 rounded bg-muted items-center justify-center text-xs font-bold text-foreground shrink-0 mt-0.5">
                30%
              </span>
              <div>
                <h4 className="text-xs font-semibold text-foreground">Skill Overlap</h4>
                <p className="text-xs text-muted-foreground">
                  Jaccard set overlap between verified candidate skills and mandatory role tags.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 rounded bg-muted items-center justify-center text-xs font-bold text-foreground shrink-0 mt-0.5">
                10%
              </span>
              <div>
                <h4 className="text-xs font-semibold text-foreground">Experience Alignment</h4>
                <p className="text-xs text-muted-foreground">
                  Linear penalty/bonus based on candidate years of experience vs. role seniority.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-muted/30 border border-border rounded-lg p-6 space-y-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Evaluation Matrix Comparison
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-card border border-border space-y-2">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold text-xs">
                <XCircle className="h-4 w-4" />
                <span>Traditional ATS / Generative AI</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>Keyword stuffing bias</li>
                <li>Hallucinated match scores</li>
                <li>Unexplainable rejection decisions</li>
                <li>Black-box applicant filtering</li>
              </ul>
            </div>

            <div className="p-4 rounded bg-card border border-border space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>SmartATS Architecture</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>Dense 384d semantic vectors</li>
                <li>spaCy verified entity extraction</li>
                <li>Auditable score breakdown</li>
                <li>Equal transparency for all roles</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKSPACE PORTALS SECTION */}
      <section className="py-12 border-t border-border space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product Modules</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            Built for candidates, recruiters, and administrators
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Candidate Card */}
          <div className="p-6 rounded-lg bg-card border border-border space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-foreground" />
              <h3 className="font-semibold text-sm text-foreground">Candidate Portal</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload resumes, inspect extracted skills, browse opportunities in a two-column workspace, and track application timelines.
            </p>
            <Link to="/candidate/dashboard" className="inline-block text-xs font-medium text-foreground hover:underline">
              Launch Candidate View &rarr;
            </Link>
          </div>

          {/* Recruiter Card */}
          <div className="p-6 rounded-lg bg-card border border-border space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-foreground" />
              <h3 className="font-semibold text-sm text-foreground">Recruiter Workspace</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Publish job postings, screen applicant queues sorted by composite score, inspect skill gaps, and schedule technical interviews.
            </p>
            <Link to="/recruiter/dashboard" className="inline-block text-xs font-medium text-foreground hover:underline">
              Launch Recruiter View &rarr;
            </Link>
          </div>

          {/* Admin Card */}
          <div className="p-6 rounded-lg bg-card border border-border space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-foreground" />
              <h3 className="font-semibold text-sm text-foreground">Admin Console</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Verify company profiles, moderate public job listings, audit platform applications, and monitor recruitment pipeline analytics.
            </p>
            <Link to="/admin/dashboard" className="inline-block text-xs font-medium text-foreground hover:underline">
              Launch Admin Console &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FINAL EDITORIAL CALL TO ACTION */}
      <section className="py-16 border-t border-border text-center space-y-6 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
          Ready to experience explainable hiring?
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Create an account to browse open roles or test the recruiter evaluation workspace with our live interactive prototype.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/register">
            <Button size="lg" className="h-10 px-6 text-xs font-medium">
              Get Started Free
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="outline" size="lg" className="h-10 px-6 text-xs font-medium">
              Explore Active Jobs
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
