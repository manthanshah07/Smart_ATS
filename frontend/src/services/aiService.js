import { MOCK_AI_ANALYSIS_RECORDS } from '../mock/ai/mockAIAnalysis'
import { MOCK_APPLICATIONS } from '../mock/applications'

/**
 * AI Analysis Service
 *
 * Provides access to explainable AI evaluation records.
 * During this frontend phase, returns mock records.
 * When the backend is ready, these methods become:
 *   GET /api/v1/ai/analysis/application/{applicationId}/
 *   GET /api/v1/ai/analysis/recruiter/{applicationId}/
 */
export const aiService = {
  /**
   * Get the AI analysis for a specific application (candidate view).
   * Returns null if analysis is pending.
   */
  getAnalysisForApplication: async (applicationId) => {
    const app = MOCK_APPLICATIONS.find((a) => a.id === Number(applicationId))
    if (!app) throw new Error(`Application #${applicationId} not found`)
    // Simulate async delay to show loading state
    return app.ai_analysis || null
  },

  /**
   * Get the AI analysis for a recruiter evaluating an application.
   * Identical data but could be extended in future with recruiter-specific notes.
   */
  getAnalysisForApplicant: async (applicationId) => {
    return aiService.getAnalysisForApplication(applicationId)
  },

  /**
   * Get all available sample analysis records (for demo/preview purposes).
   */
  getSampleAnalysisRecords: async () => {
    return { ...MOCK_AI_ANALYSIS_RECORDS }
  },
}
