'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { api } from '../lib/api'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Permission {
  id: string
  key: string
  name: string
  description: string
}

interface Role {
  id: string
  key: string
  name: string
  description: string
  isSystemRole: boolean
  permissions: { permission: Permission }[]
}

interface TenantMember {
  id: string
  tenantId: string
  userId: string
  status: string
  jobTitle: string | null
  department: string | null
  role: { id: string; key: string; name: string } | null
  user: { id: string; email: string; fullName: string; avatarURL: string | null }
}

interface Tenant {
  id: string
  name: string
  slug: string
  email: string
  industry: string
  phone: string
  timezone: string
  isActive: boolean
  websiteURL: string
  workingHours: Record<string, unknown>
  createdAt: string
}

interface TenantContextType {
  tenant: Tenant | null
  members: TenantMember[]
  roles: Role[]
  permissions: Permission[]
  currentMember: TenantMember | null
  isLoading: boolean
  error: string | null
  refetchTenant: () => Promise<void>
  refetchMembers: () => Promise<void>
  createTenant: (data: CreateTenantPayload) => Promise<void>
}

interface CreateTenantPayload {
  name: string
  email: string
  industry: string
  phone: string
  websiteURL: string
}

// ── Context ───────────────────────────────────────────────────────────────────

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user, activeTenantId, isAuthenticated, isLoading: authLoading } = useAuth()

  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [members, setMembers] = useState<TenantMember[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentMember = members.find((m) => m.userId === user?.id) ?? null

  const refetchTenant = useCallback(async () => {
    if (!activeTenantId) return
    try {
      const res = await api.get(`/tenant/${activeTenantId}`)
      setTenant(res.data?.data ?? null)
    } catch {
      setError('Failed to fetch tenant')
    }
  }, [activeTenantId])

  const refetchMembers = useCallback(async () => {
    if (!activeTenantId) return
    try {
      const res = await api.get('/tenant/members')
      setMembers(res.data?.data ?? [])
    } catch {
      setError('Failed to fetch members')
    }
  }, [activeTenantId])

  const fetchRoles = useCallback(async () => {
    if (!activeTenantId) return
    try {
      const res = await api.get('/tenant/roles')
      setRoles(res.data?.data ?? [])
    } catch {
      // non-critical, swallow
    }
  }, [activeTenantId])

  const fetchPermissions = useCallback(async () => {
    if (!activeTenantId) return
    try {
      const res = await api.get('/tenant/permissions')
      setPermissions(res.data?.data ?? [])
    } catch {
      // non-critical, swallow
    }
  }, [activeTenantId])

  useEffect(() => {
    if (authLoading || !isAuthenticated || !activeTenantId) {
      setTenant(null)
      setMembers([])
      setRoles([])
      setPermissions([])
      return
    }

    const init = async () => {
      setIsLoading(true)
      setError(null)
      try {
        await Promise.all([
          refetchTenant(),
          refetchMembers(),
          fetchRoles(),
          fetchPermissions(),
        ])
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [activeTenantId, isAuthenticated, authLoading])

  const createTenant = async (data: CreateTenantPayload) => {
    const res = await api.post('/tenant', data)
    const created = res.data?.data
    if (!created) throw new Error(res.data?.message || 'Failed to create tenant')
    // After creation, AuthContext.switchTenant triggers a re-fetch via activeTenantId change
    return created
  }

  return (
    <TenantContext.Provider
      value={{
        tenant,
        members,
        roles,
        permissions,
        currentMember,
        isLoading,
        error,
        refetchTenant,
        refetchMembers,
        createTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export const useTenant = () => {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant must be used within TenantProvider')
  return ctx
}