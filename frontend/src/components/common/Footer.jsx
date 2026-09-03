import React from 'react'

export const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-0 bg-muted/40">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row text-xs text-muted-foreground">
        <p>© 2026 SmartATS. Explainable AI-Powered Applicant Tracking System.</p>
        <div className="flex items-center gap-4">
          <span>Python + Django + DRF</span>
          <span>•</span>
          <span>Sentence Transformers</span>
          <span>•</span>
          <span>React + Vite</span>
        </div>
      </div>
    </footer>
  )
}
