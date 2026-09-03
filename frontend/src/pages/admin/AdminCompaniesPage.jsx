import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Building, ShieldCheck, ShieldAlert, Globe, MapPin, CheckCircle2 } from 'lucide-react'

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
    setFeedback(`Company verification updated for ${updated.name}.`)
    setTimeout(() => setFeedback(''), 3000)
    loadCompanies()
  }

  if (loading) return <TableSkeleton rows={4} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Registered Companies & Employers</h1>
        <p className="text-xs text-muted-foreground">Verify employer authenticity and moderate organization profiles.</p>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {feedback}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {companies.map((comp) => (
          <Card key={comp.id} className="border-border shadow-xs">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">{comp.name}</h3>
                    {comp.is_verified ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
                        Pending Audit
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{comp.industry}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleVerification(comp.id, comp.is_verified)}
                  className="text-xs h-8"
                >
                  {comp.is_verified ? 'Revoke Badge' : 'Approve & Verify'}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{comp.description}</p>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {comp.location}
                </span>
                <span className="font-semibold text-foreground">{comp.open_jobs_count} Open Jobs</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
