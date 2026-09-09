import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { Button } from '../../components/ui/button'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { Building, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react'

export const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState('')

  const loadCompanies = async () => {
    setLoading(true)
    try {
      const data = await adminService.getCompanies()
      setCompanies(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompanies()
  }, [])

  const handleToggleVerification = async (companyId, currentVerified) => {
    const updated = await adminService.toggleCompanyVerification(companyId, !currentVerified)
    setFeedback(`Verification status updated for ${updated.name}.`)
    setTimeout(() => setFeedback(''), 3000)
    loadCompanies()
  }

  if (loading) return <TableSkeleton rows={4} />

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Employer Organizations & Verification
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Audit employer authenticity, corporate domains, and verified organization credentials.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Companies List */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Employer</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Industry</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Location</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Active Requisitions</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Verification Status</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {companies.map((comp) => (
                <tr key={comp.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground">{comp.name}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{comp.industry}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{comp.location}</td>
                  <td className="py-3.5 px-4 font-medium text-foreground">{comp.open_jobs_count} open roles</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {comp.is_verified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-700 font-medium">Pending Audit</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleVerification(comp.id, comp.is_verified)}
                      className="text-xs h-7 px-2.5"
                    >
                      {comp.is_verified ? 'Revoke' : 'Verify Employer'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
