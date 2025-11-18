import { apiRequest } from './api'
import type { LoginCredentials, AuthResponse, User } from '@/types'

export const authService = {
  // Login do usuário
  async login(credentials: LoginCredentials) {
    return apiRequest<AuthResponse>('POST', '/auth/login', credentials)
  },

  // Refresh do token
  async refreshToken() {
    return apiRequest<AuthResponse>('POST', '/auth/refresh')
  },

  // Logout
  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    window.location.href = '/login'
  },

  // Salvar dados de autenticação
  saveAuthData(token: string, user: User) {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_data', JSON.stringify(user))
  },

  // Obter dados do usuário
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  },

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token')
    return !!token
  },

  // Obter token
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },
}

