import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { ProtectedRoute } from './ProtectedRoute'

// Public Pages
import { LandingPage } from '../pages/public/LandingPage'
import { JobsPage } from '../pages/public/JobsPage'
import { JobDetailsPage } from '../pages/public/JobDetailsPage'
import { NotFoundPage } from '../pages/public/NotFoundPage'

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'

// Candidate Pages
import { CandidateDashboard } from '../pages/candidate/CandidateDashboard'
import { CandidateProfilePage } from '../pages/candidate/CandidateProfilePage'
import { CandidateApplicationsPage } from '../pages/candidate/CandidateApplicationsPage'

// Recruiter Pages
import { RecruiterDashboard } from '../pages/recruiter/RecruiterDashboard'
import { RecruiterJobsPage } from '../pages/recruiter/RecruiterJobsPage'
import { RecruiterApplicantsPage } from '../pages/recruiter/RecruiterApplicantsPage'

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / Main Layout */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />

        {/* Candidate Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/profile" element={<CandidateProfilePage />} />
          <Route path="/candidate/applications" element={<CandidateApplicationsPage />} />
        </Route>

        {/* Recruiter Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['RECRUITER']} />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
          <Route path="/recruiter/jobs/:id/applicants" element={<RecruiterApplicantsPage />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
    </Routes>
  )
}
