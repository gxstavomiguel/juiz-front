import { apiRequest } from './api'
import type { Acordao, AcordaoFilters, PaginatedResponse, ETLParams, ApiResponse } from '@/types'

export const acordaosService = {
  // Buscar acórdãos com filtros e paginação
  async getAcordaos(filters: AcordaoFilters = {}) {
    const searchParams = {
      page: filters.page || 1,
      size: filters.limit || 1000,
      ...(filters.processo && { processo: filters.processo }),
      ...(filters.orgao_judicante && { orgao_judicante: filters.orgao_judicante }),
      ...(filters.relator && { relator: filters.relator }),
      ...(filters.busca_texto && { texto_busca: filters.busca_texto }),
      ...(filters.intervalo_datas?.inicio && { data_julgamento_inicio: filters.intervalo_datas.inicio }),
      ...(filters.intervalo_datas?.fim && { data_julgamento_fim: filters.intervalo_datas.fim }),
      // Adicionar filtros de data de publicação se necessário
    }

    // O endpoint de busca é POST e espera um corpo JSON
    return apiRequest<PaginatedResponse<Acordao>>(
      'GET',
      '/acordaos/'
    )
  },

  // Executar ETL para coleta de novos acórdãos
  async runETL(params: ETLParams) {
    const etlPayload: any = {
      data_inicio: params.dataInicio,
      data_fim: params.dataFim,
    };

    const filtrosAdicionais: { [key: string]: any } = {};
    if (params.orgaoJudicante) {
      filtrosAdicionais.orgaosJudicantes = [{ descricao: params.orgaoJudicante }];
    }
    if (params.tipoDocumento) {
      filtrosAdicionais.tipos = [{ nome: params.tipoDocumento }];
    }

    if (Object.keys(filtrosAdicionais).length > 0) {
      etlPayload.filtros_adicionais = filtrosAdicionais;
    }

    return apiRequest<{ processo_id: string; status: string; message: string }>(
      'POST',
      '/acordaos/etl/run',
      etlPayload
    );
  },

  // Exportar acórdãos
  async exportAcordaos(filters: AcordaoFilters, format: 'csv' | 'xlsx' = 'xlsx') {
    const params = {
      format,
      ...(filters.processo && { processo: filters.processo }),
      ...(filters.orgao_judicante && { orgao_judicante: filters.orgao_judicante }),
      ...(filters.relator && { relator: filters.relator }),
      ...(filters.tipo_documento && { tipo_documento: filters.tipo_documento }),
      ...(filters.busca_texto && { busca_texto: filters.busca_texto }),
      ...(filters.intervalo_datas?.inicio && { data_inicio: filters.intervalo_datas.inicio }),
      ...(filters.intervalo_datas?.fim && { data_fim: filters.intervalo_datas.fim }),
    }

    try {
      const response = await fetch(`http://localhost:8000/acordaos/export?${new URLSearchParams(params)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao exportar acórdãos')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `acordaos.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },



  async getDashboardStats(): Promise<ApiResponse<any>> {
    try {
      const response = await apiRequest(
        'GET',
        '/acordaos/stats/geral'
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || error.message };
    }
  },

  async getErrorStats(): Promise<ApiResponse<any>> {
    try {
      const response = await apiRequest(
        'GET',
        '/errors/stats/dashboard'
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || error.message };
    }
  },
}