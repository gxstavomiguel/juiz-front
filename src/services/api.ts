import axios, { AxiosInstance, AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types'

// Configuração base da API
const API_BASE_URL = 'http://localhost:8000/api/v1'

// Criar instância do axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    // Tratar erros de autenticação
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Função helper para fazer requisições
export const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  params?: any
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.request({
      method,
      url,
      data,
      params,
    })

    return {
      success: true,
      data: response.data,
    }
  } catch (error: any) {
    console.error('API Error:', error)
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Erro desconhecido',
    }
  }
}

export default apiClient

