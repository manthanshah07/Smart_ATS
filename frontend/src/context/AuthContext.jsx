import React, { createContext, useState, useEffect, useCallback } from 'react'
import apiClient, { setTokens, clearAuthStorage, getRefreshToken, getAccessToken } from '../services/api'
import { MOCK_USERS } from '../mock/users'

export const AuthContext = createContext(null)

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('smartats_user')
      if (stored) return JSON.parse(stored)
    } catch {
      // ignore
    }
    // Only default to mock user if explicitly in demo mode
    return isDemoMode ? MOCK_USERS.candidate : null
  })

  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    const token = getAccessToken()
    if (!token && !isDemoMode) {
      setLoading(false)
      return
    }

    try {
      if (isDemoMode && !token) {
        setLoading(false)
        return
      }
      const response = await apiClient.get('/auth/me/')
      setUser(response.data)
      localStorage.setItem('smartats_user', JSON.stringify(response.data))
    } catch (err) {
      console.warn('Session check failed:', err.message)
      if (!isDemoMode) {
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null)
    }
    window.addEventListener('smartats_auth_expired', handleAuthExpired)
    return () => window.removeEventListener('smartats_auth_expired', handleAuthExpired)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/token/', { email, password })
      const { access, refresh, user: basicUser } = response.data
      setTokens(access, refresh)
      setUser(basicUser)
      localStorage.setItem('smartats_user', JSON.stringify(basicUser))
      return basicUser
    } catch (apiErr) {
      if (isDemoMode) {
        console.warn('Falling back to demo auth')
        const lower = email.toLowerCase()
        let matched = MOCK_USERS.candidate
        if (lower.includes('recruiter') || lower.includes('alex')) {
          matched = MOCK_USERS.recruiter
        } else if (lower.includes('admin') || lower.includes('sarah')) {
          matched = MOCK_USERS.admin
        }
        setUser(matched)
        localStorage.setItem('smartats_user', JSON.stringify(matched))
        return matched
      }
      throw apiErr
    }
  }

  const register = async (userData) => {
    try {
      const response = await apiClient.post('/auth/register/', userData)
      return response.data
    } catch (apiErr) {
      if (isDemoMode) {
        return { id: 999, ...userData, is_active: true }
      }
      throw apiErr
    }
  }

  const logout = async () => {
    const refresh = getRefreshToken()
    if (refresh && !isDemoMode) {
      try {
        await apiClient.post('/auth/logout/', { refresh })
      } catch {
        // ignore errors on logout
      }
    }
    clearAuthStorage()
    setUser(null)
  }

  // Quick Persona / Role Switcher for Prototype Review
  const switchDemoRole = (role) => {
    if (!isDemoMode) return
    let target = MOCK_USERS.candidate
    if (role === 'RECRUITER') target = MOCK_USERS.recruiter
    if (role === 'ADMIN') target = MOCK_USERS.admin

    setUser(target)
    localStorage.setItem('smartats_user', JSON.stringify(target))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isCandidate: user?.role === 'CANDIDATE',
        isRecruiter: user?.role === 'RECRUITER',
        isAdmin: user?.role === 'ADMIN',
        loading,
        login,
        register,
        logout,
        switchDemoRole,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
