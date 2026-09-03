import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import { useAuth } from '../../hooks/useAuth'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Search, MapPin, Briefcase, Clock, Sparkles, Building, ArrowRight } from 'lucide-react'

export const JobsPage = () => {
  const { isCandidate } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter States
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('ALL')
  const [jobType, setJobType] = useState('ALL')

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const data = await jobService.getJobs({ search, location, job_type: jobType, status: 'OPEN' })
        setJobs(data)
      } catch (err) {
        console.error('Error fetching jobs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [search, location, jobType])

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Explore Open Positions</h1>
        <p className="text-sm text-muted-foreground">
          Discover vetted engineering and product opportunities evaluated by our explainable matching architecture.
        </p>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4 sm:p-6">
          <div className="grid sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title, skill (e.g. Python, React), or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Location Select */}
            <div className="sm:col-span-3">
              <Select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="ALL">All Locations</option>
                <option value="San Francisco">San Francisco, CA</option>
                <option value="Austin">Austin, TX</option>
                <option value="New York">New York, NY</option>
                <option value="Remote">Remote Only</option>
              </Select>
            </div>

            {/* Job Type Select */}
            <div className="sm:col-span-3">
              <Select value={jobType} onChange={(e) => setJobType(e.target.value)}>
                <option value="ALL">All Job Types</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="REMOTE">Remote</option>
                <option value="INTERN">Internship</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>Showing <strong className="text-foreground">{jobs.length}</strong> active opportunities</span>
        {isCandidate && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Explainable AI match evaluations generated upon application
          </span>
        )}
      </div>

      {/* Jobs Listing */}
      {loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="border-border/80 shadow-xs hover:border-primary/50 transition duration-200 group">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Job Details */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-lg font-bold text-foreground group-hover:text-primary transition"
                      >
                        {job.title}
                      </Link>
                      <StatusBadge type="job" status={job.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <Building className="h-3.5 w-3.5 text-muted-foreground" />
                        {job.company_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        {job.job_type.replace('_', ' ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {job.experience_min_years}+ yrs exp
                      </span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.required_skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-[11px] font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                    <Link to={`/jobs/${job.id}`}>
                      <Button size="sm" className="gap-1.5 shadow-xs">
                        View Role Details <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching job postings found"
          description="Try broadening your search query, selecting different location parameters, or clearing filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('')
            setLocation('ALL')
            setJobType('ALL')
          }}
        />
      )}
    </div>
  )
}
