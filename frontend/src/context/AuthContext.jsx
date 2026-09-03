import React, { createContext, useState, useEffect, useCallback } from 'react'
import apiClient, { setTokens, clearAuthStorage, getRefreshToken, getAccessToken } from '../services/api'
import { MOCK_USERS } from '../mock/users'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  // Initialize with Candidate mock user for instant prototype navigation, or localStorage session
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('smartats_user')
      if (stored) return JSON.parse(stored)
    } catch {
      // ignore
    }
    return MOCK_USERS.candidate
  })

  const [loading, setLoading] = useState(false)

  const fetchProfile = useCallback(async () => {
    const token = getAccessToken()
    if (!token) return

    try {
      const response = await apiClient.get('/auth/me/')
      setUser(response.data)
      localStorage.setItem('smartats_user', JSON.stringify(response.data))
    } catch (err) {
      console.warn('Session check:', err.message)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const login = async (email, password) => {
    try {
      // Try real backend first if available
      const response = await apiClient.post('/auth/token/', { email, password })
      const { access, refresh, user: basicUser } = response.data
      setTokens(access, refresh)
      setUser(basicUser)
      localStorage.setItem('smartats_user', JSON.stringify(basicUser))
      return basicUser
    } catch (apiErr) {
      // Fallback for prototype testing: find mock persona
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
  }

  const register = async (userData) => {
    try {
      const response = await apiClient.post('/auth/register/', userData)
      return response.data
    } catch {
      // Prototype mock registration success
      return { id: 999, ...userData, is_active: true }
    }
  }

  const logout = async () => {
    const refresh = getRefreshToken()
    if (refresh) {
      try {
        await apiClient.post('/auth/logout/', { refresh })
      } catch {
        // ignore
      }
    }
    clearAuthStorage()
    // Reset to unauthenticated
    setUser(null)
  }

  // Quick Persona / Role Switcher for Prototype Review
  const switchDemoRole = (role) => {
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
