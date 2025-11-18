import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '@/services/authService'
import type { User, LoginCredentials } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há dados de autenticação salvos
    const savedUser = authService.getCurrentUser()
    const token = authService.getToken()

    if (savedUser && token) {
      setUser(savedUser)
    }

    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      
      // Para MVP, simular login bem-sucedido
      // Em produção, faria a chamada real para a API
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: 'Dr. João Silva',
        role: 'advogado',
      }
      
      const mockToken = 'mock_jwt_token_' + Date.now()
      
      authService.saveAuthData(mockToken, mockUser)
      setUser(mockUser)
      
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Erro ao fazer login' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken()
      if (response.success && response.data) {
        authService.saveAuthData(response.data.token, response.data.user)
        setUser(response.data.user)
      }
    } catch (error) {
      console.error('Erro ao renovar token:', error)
      logout()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export default AuthContext

