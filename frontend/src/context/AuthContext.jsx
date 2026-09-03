import React, { createContext, useState, useEffect } from 'react'
import apiClient from '../services/api'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('smartats_user')
      const token = localStorage.getItem('smartats_access_token')
      if (storedUser && token) {
        setUser(JSON.parse(storedUser))
      }
    } catch (e) {
      console.error("Failed to restore auth session:", e)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userData, tokens) => {
    localStorage.setItem('smartats_access_token', tokens.access)
    localStorage.setItem('smartats_refresh_token', tokens.refresh)
    localStorage.setItem('smartats_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('smartats_access_token')
    localStorage.removeItem('smartats_refresh_token')
    localStorage.removeItem('smartats_user')
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
