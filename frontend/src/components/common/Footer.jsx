import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12 text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-foreground text-background font-bold text-[10px]">
                S
              </span>
              SmartATS
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Transparent, explainable applicant tracking platform built for high-trust recruitment workflows.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="hover:text-foreground transition">Explore Roles</Link></li>
              <li><a href="/#how-it-works" className="hover:text-foreground transition">Matching Methodology</a></li>
              <li><a href="/#architecture" className="hover:text-foreground transition">Scoring Architecture</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs">Portals</h4>
            <ul className="space-y-2">
              <li><Link to="/candidate/dashboard" className="hover:text-foreground transition">Candidate Workspace</Link></li>
              <li><Link to="/recruiter/dashboard" className="hover:text-foreground transition">Recruiter Workspace</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-foreground transition">Admin Console</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs">Security & Transparency</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Deterministic 60/30/10 AI Engine</li>
              <li>spaCy Entity Extraction</li>
              <li>Zero Black-Box Bias Guarantee</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} SmartATS Platform. Production-grade recruitment prototype.</p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-foreground transition">Sign In</Link>
            <Link to="/register" className="hover:text-foreground transition">Create Account</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
