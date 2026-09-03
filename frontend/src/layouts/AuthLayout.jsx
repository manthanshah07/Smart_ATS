import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Branding Hero */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 text-white p-12">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-6 w-6" />
          </div>
          <span>SmartATS</span>
        </div>
        <div className="space-y-4 max-w-lg">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Next-Gen Explainable AI Recruitment Pipeline
          </h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Deterministic semantic embeddings, spaCy skill extraction, and transparent match scoring for Candidates, Recruiters, and Admins.
          </p>
        </div>
        <div className="text-xs text-zinc-500 font-mono">
          SmartATS Architecture v1.0.0
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
