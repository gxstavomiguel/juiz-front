import { apiRequest } from './api'
import type { Analise, AcordaoFilters } from '@/types'

export const analisesService = {
  // Criar nova análise
  async createAnalise(pergunta: string, filtros: AcordaoFilters) {
    return apiRequest<Analise>('POST', '/analises', {
      pergunta,
      filtros,
    })
  },

  // Listar análises do usuário
  async getAnalises(page: number = 1, limit: number = 10) {
    return apiRequest<{
      data: Analise[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>('GET', '/analises', undefined, { page, limit })
  },

  // Obter análise por ID
  async getAnaliseById(id: string) {
    return apiRequest<Analise>('GET', `/analises/${id}`)
  },

  // Salvar análise
  async saveAnalise(analise: Partial<Analise>) {
    if (analise.id) {
      return apiRequest<Analise>('PUT', `/analises/${analise.id}`, analise)
    } else {
      return apiRequest<Analise>('POST', '/analises/save', analise)
    }
  },

  // Deletar análise
  async deleteAnalise(id: string) {
    return apiRequest<{ success: boolean }>('DELETE', `/analises/${id}`)
  },

  // Exportar análise para PDF
  async exportAnalise(id: string, format: 'pdf' | 'docx' = 'pdf') {
    try {
      const response = await fetch(`http://localhost:8000/analises/${id}/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao exportar análise')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analise_${id}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // Compartilhar análise
  async shareAnalise(id: string, emails: string[]) {
    return apiRequest<{ success: boolean; shareUrl: string }>('POST', `/analises/${id}/share`, {
      emails,
    })
  },

  // Obter estatísticas de análises
  async getStats() {
    return apiRequest<{
      total: number
      ultimaSemana: number
      porTema: Record<string, number>
      tempoMedio: number
    }>('GET', '/analises/stats')
  },
}

