import React, { createContext, useState, useEffect, useCallback } from 'react'
import apiClient, { setTokens, clearAuthStorage, getRefreshToken, getAccessToken } from '../services/api'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await apiClient.get('/auth/me/')
      setUser(response.data)
      localStorage.setItem('smartats_user', JSON.stringify(response.data))
    } catch (err) {
      console.warn("Session expired or invalid:", err.message)
      clearAuthStorage()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/token/', { email, password })
    const { access, refresh, user: basicUser } = response.data
    setTokens(access, refresh)
    setUser(basicUser)
    localStorage.setItem('smartats_user', JSON.stringify(basicUser))

    // Re-fetch rich profile details asynchronously
    try {
      const meRes = await apiClient.get('/auth/me/')
      setUser(meRes.data)
      localStorage.setItem('smartats_user', JSON.stringify(meRes.data))
      return meRes.data
    } catch {
      return basicUser
    }
  }

  const register = async (userData) => {
    const response = await apiClient.post('/auth/register/', userData)
    return response.data
  }

  const logout = async () => {
    const refresh = getRefreshToken()
    if (refresh) {
      try {
        await apiClient.post('/auth/logout/', { refresh })
      } catch (err) {
        console.warn("Backend token blacklist failed:", err.message)
      }
    }
    clearAuthStorage()
    setUser(null)
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
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
