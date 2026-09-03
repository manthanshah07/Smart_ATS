import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { AppLayout } from '../components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'

// Public Pages
import { LandingPage } from '../pages/public/LandingPage'
import { JobsPage } from '../pages/public/JobsPage'
import { JobDetailsPage } from '../pages/public/JobDetailsPage'
import { UnauthorizedPage } from '../pages/public/UnauthorizedPage'
import { NotFoundPage } from '../pages/public/NotFoundPage'

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'

// Candidate Pages
import { CandidateDashboard } from '../pages/candidate/CandidateDashboard'
import { CandidateProfilePage } from '../pages/candidate/CandidateProfilePage'
import { CandidateResumePage } from '../pages/candidate/CandidateResumePage'
import { CandidateApplicationsPage } from '../pages/candidate/CandidateApplicationsPage'
import { CandidateApplicationDetailPage } from '../pages/candidate/CandidateApplicationDetailPage'
import { CandidateInterviewsPage } from '../pages/candidate/CandidateInterviewsPage'
import { CandidateNotificationsPage } from '../pages/candidate/CandidateNotificationsPage'
import { CandidateSettingsPage } from '../pages/candidate/CandidateSettingsPage'

// Recruiter Pages
import { RecruiterDashboard } from '../pages/recruiter/RecruiterDashboard'
import { CompanyProfilePage } from '../pages/recruiter/CompanyProfilePage'
import { RecruiterJobsPage } from '../pages/recruiter/RecruiterJobsPage'
import { JobCreateEditPage } from '../pages/recruiter/JobCreateEditPage'
import { JobApplicantsPage } from '../pages/recruiter/JobApplicantsPage'
import { RecruiterApplicationDetailPage } from '../pages/recruiter/RecruiterApplicationDetailPage'
import { RecruiterInterviewsPage } from '../pages/recruiter/RecruiterInterviewsPage'
import { RecruiterNotificationsPage } from '../pages/recruiter/RecruiterNotificationsPage'
import { RecruiterSettingsPage } from '../pages/recruiter/RecruiterSettingsPage'

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { AdminCompaniesPage } from '../pages/admin/AdminCompaniesPage'
import { AdminJobsPage } from '../pages/admin/AdminJobsPage'
import { AdminApplicationsPage } from '../pages/admin/AdminApplicationsPage'
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage'
import { AdminNotificationsPage } from '../pages/admin/AdminNotificationsPage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Pages (RootLayout) */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* 2. Candidate Portal (AppLayout Shell) */}
      <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
        <Route element={<AppLayout />}>
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/profile" element={<CandidateProfilePage />} />
          <Route path="/candidate/resume" element={<CandidateResumePage />} />
          <Route path="/candidate/applications" element={<CandidateApplicationsPage />} />
          <Route path="/candidate/applications/:id" element={<CandidateApplicationDetailPage />} />
          <Route path="/candidate/interviews" element={<CandidateInterviewsPage />} />
          <Route path="/candidate/notifications" element={<CandidateNotificationsPage />} />
          <Route path="/candidate/settings" element={<CandidateSettingsPage />} />
        </Route>
      </Route>

      {/* 3. Recruiter Portal (AppLayout Shell) */}
      <Route element={<ProtectedRoute allowedRoles={['RECRUITER']} />}>
        <Route element={<AppLayout />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/company" element={<CompanyProfilePage />} />
          <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
          <Route path="/recruiter/jobs/new" element={<JobCreateEditPage />} />
          <Route path="/recruiter/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/recruiter/jobs/:id/edit" element={<JobCreateEditPage />} />
          <Route path="/recruiter/jobs/:id/applicants" element={<JobApplicantsPage />} />
          <Route path="/recruiter/applications/:id" element={<RecruiterApplicationDetailPage />} />
          <Route path="/recruiter/interviews" element={<RecruiterInterviewsPage />} />
          <Route path="/recruiter/notifications" element={<RecruiterNotificationsPage />} />
          <Route path="/recruiter/settings" element={<RecruiterSettingsPage />} />
        </Route>
      </Route>

      {/* 4. Admin Portal (AppLayout Shell) */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/companies" element={<AdminCompaniesPage />} />
          <Route path="/admin/jobs" element={<AdminJobsPage />} />
          <Route path="/admin/applications" element={<AdminApplicationsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      {/* 5. Authentication Pages (AuthLayout) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* 6. Catch-All 404 */}
      <Route element={<RootLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
