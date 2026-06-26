'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, setToken, clearToken, getActiveTenantId, setActiveTenantId, clearActiveTenantId } from '../../lib/auth'
import { apiRequest } from '../../lib/api'

interface User {
  id: string
  fullName: string
  email: string
  emailVerified: boolean
  createdAt: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  activeTenantId: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  switchTenant: (tenantId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [activeTenantId, setActiveTenantIdState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshAccessToken = async () => {
    try {
      const res = await apiRequest('/auth/refresh', { method: 'POST' })
      if (res.data?.accessToken) {
        setToken(res.data.accessToken)
        setAccessToken(res.data.accessToken)
      } else {
        throw new Error('No token returned')
      }
    } catch (err) {
      clearToken()
      setUser(null)
      setAccessToken(null)
      throw err
    }
  }

  const fetchMe = async (tokenOverride?: string) => {
    try {
      // Temporarily override the getToken during this request if passed
      // apiRequest natively reads getToken() so we have to use standard fetch or rely on what's in storage
      // Since apiRequest uses getToken() synchronously, we'll let it read from localStorage.
      const res = await apiRequest('/auth/me', { method: 'GET' })
      if (res.data?.user) {
        setUser(res.data.user)
        setAccessToken(getToken())
        
        let currentTenantId = getActiveTenantId()
        const members = res.data.user.tenantMembers || []
        
        if (members.length > 0) {
          const isValid = members.some((m: any) => m.tenantId === currentTenantId)
          if (!currentTenantId || !isValid) {
            currentTenantId = members[0].tenantId
            if (currentTenantId) setActiveTenantId(currentTenantId)
          }
        } else {
          currentTenantId = null
          clearActiveTenantId()
        }
        setActiveTenantIdState(currentTenantId)
        
      } else {
        throw new Error('No user returned')
      }
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken()
        if (!token) {
          throw new Error('No token found')
        }
        await fetchMe()
      } catch (err) {
        // If 401 or no token, try to refresh
        try {
          await refreshAccessToken()
          await fetchMe()
        } catch (refreshErr) {
          clearToken()
          clearActiveTenantId()
          setUser(null)
          setAccessToken(null)
          setActiveTenantIdState(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (res.data?.accessToken) {
      setToken(res.data.accessToken)
      setAccessToken(res.data.accessToken)
      setUser(res.data.user)
      
      const members = res.data.user?.tenantMembers || []
      if (members.length > 0) {
        const firstTenantId = members[0].tenantId
        setActiveTenantId(firstTenantId)
        setActiveTenantIdState(firstTenantId)
      }
      
      router.push('/dashboard')
    } else {
      throw new Error(res.message || 'Login failed')
    }
  }

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      clearToken()
      clearActiveTenantId()
      setUser(null)
      setAccessToken(null)
      setActiveTenantIdState(null)
      router.push('/signin')
    }
  }

  const switchTenant = (tenantId: string) => {
    setActiveTenantId(tenantId)
    setActiveTenantIdState(tenantId)
    // Optional: Could trigger a reload or re-fetch to update scoped data
    window.location.href = '/dashboard'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        activeTenantId,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshAccessToken,
        switchTenant,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
