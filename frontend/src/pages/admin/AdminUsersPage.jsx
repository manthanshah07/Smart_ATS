import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/button'
import { Modal } from '../../components/ui/Modal'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Search, ShieldCheck, UserX, UserCheck, CheckCircle2 } from 'lucide-react'

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
    setStatusFeedback(`Account ${selectedUser.email} marked as ${newStatus ? 'active' : 'suspended'}.`)
    setTimeout(() => setStatusFeedback(''), 3000)
    setSelectedUser(null)
    loadUsers()
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            User Account Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Audit registered candidate profiles, recruiter authorizations, and access credentials.
          </p>
        </div>
      </div>

      {statusFeedback && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="grid sm:grid-cols-12 gap-3 p-3 rounded-lg border border-border bg-card">
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <div className="sm:col-span-4">
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="ALL">All Account Roles</option>
            <option value="CANDIDATE">Candidates</option>
            <option value="RECRUITER">Recruiters</option>
            <option value="ADMIN">Administrators</option>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : users.length === 0 ? (
        <EmptyState
          title="No users match search"
          description="Try modifying search keywords or clearing role filters."
          actionText="Reset Search"
          onAction={() => {
            setSearch('')
            setRoleFilter('ALL')
          }}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">User Profile</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Role</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Status</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Date Joined</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-foreground block">
                        {u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : u.email}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[10px] font-mono uppercase bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-semibold">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 dark:text-rose-400 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">{u.date_joined}</td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(u)
                          setConfirmModalOpen(true)
                        }}
                        className={`text-xs h-7 px-2 ${
                          u.is_active
                            ? 'text-muted-foreground hover:text-rose-700 hover:bg-rose-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {u.is_active ? 'Suspend' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title={selectedUser?.is_active ? 'Suspend User Access' : 'Activate User Access'}
      >
        <div className="space-y-4 text-xs">
          <p className="text-muted-foreground leading-relaxed">
            Are you sure you want to {selectedUser?.is_active ? 'suspend' : 'activate'} access for account{' '}
            <strong className="text-foreground">{selectedUser?.email}</strong>?
          </p>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant={selectedUser?.is_active ? 'destructive' : 'default'}
              size="sm"
              onClick={handleToggleConfirm}
              className="text-xs"
            >
              Confirm {selectedUser?.is_active ? 'Suspension' : 'Activation'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
