import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Modal } from '../../components/ui/Modal'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Users, Search, ShieldCheck, UserX, UserCheck, CheckCircle2 } from 'lucide-react'

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  // Deactivation Modal State
  const [selectedUser, setSelectedUser] = useState(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [statusFeedback, setStatusFeedback] = useState('')

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await adminService.getUsers({ search, role: roleFilter })
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [search, roleFilter])

  const handleToggleConfirm = async () => {
    if (!selectedUser) return
    const newStatus = !selectedUser.is_active
    await adminService.toggleUserStatus(selectedUser.id, newStatus)
    setConfirmModalOpen(false)
    setStatusFeedback(`User ${selectedUser.email} has been ${newStatus ? 'activated' : 'deactivated'}.`)
    setTimeout(() => setStatusFeedback(''), 3000)
    setSelectedUser(null)
    loadUsers()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">User Directory & Governance</h1>
          <p className="text-xs text-muted-foreground">Audit accounts, manage role assignments, and enforce access controls.</p>
        </div>
      </div>

      {statusFeedback && (
        <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {statusFeedback}
        </div>
      )}

      {/* Filter Bar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="text-xs">
              <option value="ALL">All Roles</option>
              <option value="CANDIDATE">Candidates</option>
              <option value="RECRUITER">Recruiters</option>
              <option value="ADMIN">Administrators</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : users.length > 0 ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider border-b border-border/80">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Registered</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition">
                    <td className="p-4">
                      <div className="font-bold text-foreground">{u.first_name} {u.last_name}</div>
                      <div className="text-muted-foreground font-mono text-[11px]">{u.email}</div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={
                          u.role === 'ADMIN'
                            ? 'bg-purple-500/10 text-purple-700 border-purple-300'
                            : u.role === 'RECRUITER'
                            ? 'bg-blue-500/10 text-blue-700 border-blue-300'
                            : 'bg-emerald-500/10 text-emerald-700 border-emerald-300'
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          u.is_active
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-rose-500/10 text-rose-600'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(u)
                            setConfirmModalOpen(true)
                          }}
                          className={`text-xs h-7 ${u.is_active ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                        >
                          {u.is_active ? 'Deactivate' : 'Reactivate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try modifying search query or role filters."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch('')
            setRoleFilter('ALL')
          }}
        />
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title={selectedUser?.is_active ? 'Deactivate User Account' : 'Reactivate User Account'}
        description={`Changing status for ${selectedUser?.email}`}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant={selectedUser?.is_active ? 'destructive' : 'default'}
              onClick={handleToggleConfirm}
            >
              Confirm {selectedUser?.is_active ? 'Deactivation' : 'Reactivation'}
            </Button>
          </>
        }
      >
        <p className="text-xs text-muted-foreground leading-relaxed">
          {selectedUser?.is_active
            ? 'Deactivating this user will immediately invalidate active JWT sessions and block all authentication attempts across Candidate and Recruiter portals.'
            : 'Reactivating this user will restore full portal access.'}
        </p>
      </Modal>
    </div>
  )
}
