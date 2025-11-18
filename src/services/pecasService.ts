import { apiRequest } from './api'
import type { Peca } from '@/types'

export const pecasService = {
  // Gerar nova peça
  async generatePeca(
    tipoPeca: string,
    situacao: string,
    acordaosReferencia: string[] = [],
    instrucoes?: string
  ) {
    return apiRequest<Peca>('POST', '/pecas/generate', {
      tipo_peca: tipoPeca,
      situacao,
      acordaos_referencia: acordaosReferencia,
      instrucoes,
    })
  },

  // Listar peças do usuário
  async getPecas(page: number = 1, limit: number = 10) {
    return apiRequest<{
      data: Peca[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>('GET', '/pecas', undefined, { page, limit })
  },

  // Obter peça por ID
  async getPecaById(id: string) {
    return apiRequest<Peca>('GET', `/pecas/${id}`)
  },

  // Salvar peça
  async savePeca(peca: Partial<Peca>) {
    if (peca.id) {
      return apiRequest<Peca>('PUT', `/pecas/${peca.id}`, peca)
    } else {
      return apiRequest<Peca>('POST', '/pecas', peca)
    }
  },

  // Deletar peça
  async deletePeca(id: string) {
    return apiRequest<{ success: boolean }>('DELETE', `/pecas/${id}`)
  },

  // Exportar peça para PDF/DOCX
  async exportPeca(id: string, format: 'pdf' | 'docx' = 'pdf') {
    try {
      const response = await fetch(`http://localhost:8000/pecas/${id}/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao exportar peça')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `peca_${id}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // Revisar peça com IA
  async reviewPeca(id: string, instrucoes?: string) {
    return apiRequest<{ sugestoes: string[]; pecaRevisada: string }>('POST', `/pecas/${id}/review`, {
      instrucoes,
    })
  },

  // Citar acórdãos em uma peça
  async citeAcordaos(pecaId: string, acordaosIds: string[], posicao: number) {
    return apiRequest<{ conteudoAtualizado: string }>('POST', `/pecas/${pecaId}/cite`, {
      acordaos_ids: acordaosIds,
      posicao,
    })
  },

  // Obter templates de peças
  async getTemplates() {
    return apiRequest<{
      id: string
      nome: string
      tipo: string
      template: string
    }[]>('GET', '/pecas/templates')
  },

  // Criar peça a partir de template
  async createFromTemplate(templateId: string, dados: Record<string, any>) {
    return apiRequest<Peca>('POST', `/pecas/templates/${templateId}`, dados)
  },

  // Obter estatísticas de peças
  async getStats() {
    return apiRequest<{
      total: number
      ultimaSemana: number
      porTipo: Record<string, number>
      tempoMedio: number
    }>('GET', '/pecas/stats')
  },

  // Validar peça com checklist jurídico
  async validatePeca(id: string) {
    return apiRequest<{
      score: number
      issues: Array<{
        type: 'error' | 'warning' | 'info'
        message: string
        line?: number
      }>
      suggestions: string[]
    }>('POST', `/pecas/${id}/validate`)
  },
}

