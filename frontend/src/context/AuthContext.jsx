import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('token')
      if (savedToken) {
        setToken(savedToken)
        try {
          const res = await api.get('/auth/me')
          setUser(res.data.data || res.data.user || res.data)
        } catch {
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const data = res.data.data || res.data
    const { token: newToken, user: newUser } = data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(newUser)
    return { user: newUser, token: newToken }
  }

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData)
    const data = res.data.data || res.data
    const { token: newToken, user: newUser } = data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(newUser)
    return { user: newUser, token: newToken }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = { user, token, login, register, logout, loading }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}