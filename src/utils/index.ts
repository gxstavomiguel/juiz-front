// Tipos de usuário
export interface User {
  id: string
  email: string
  name: string
  role: 'advogado' | 'juiz' | 'promotor' | 'analista'
  avatar?: string
}

// Tipos de acórdão
export interface Acordao {
  id: number
  processo: string
  orgao_judicante?: string
  relator?: string
  julgamento?: string // Data no formato ISO string (YYYY-MM-DD)
  publicacao?: string // Data no formato ISO string (YYYY-MM-DD)
  ementa?: string
  tipo_documento?: string
  url_completa?: string
  data_extracao?: string // Data e hora no formato ISO string
  inteiro_teor?: string
}

// Filtros para busca de acórdãos
export interface AcordaoFilters {
  processo?: string
  orgao_judicante?: string
  relator?: string
  intervalo_datas?: {
    inicio: string
    fim: string
  }
  tipo_documento?: string
  busca_texto?: string
  page?: number
  limit?: number
}

// Resposta paginada
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

// Tipos para chat/JurisGênio
export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  references?: Reference[]
}

export interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

// Referências para citações
export interface Reference {
  processo: string
  url_completa: string
  trechos_citados: string[]
}

// Tipos para análises
export interface Analise {
  id: string
  pergunta: string
  filtros: AcordaoFilters
  resultado: string
  referencias: Reference[]
  createdAt: Date
  userId: string
}

// Tipos para peças processuais
export interface Peca {
  id: string
  tipo_peca: 'petição' | 'contrarrazões' | 'agravo' | 'recurso' | 'outros'
  situacao: string
  conteudo: string
  referencias: Reference[]
  createdAt: Date
  updatedAt: Date
  userId: string
}

// Tipos para dashboard
export interface DashboardStats {
  totalAcordaos: number
  coletasUltimas24h: number
  errosETL: number
  geracoesDia: number
}

// Tipos para ETL
export interface ETLParams {
  dataInicio?: string
  dataFim?: string
  orgaoJudicante?: string
  tipoDocumento?: string
}

// Estados de loading
export interface LoadingState {
  isLoading: boolean
  error?: string
}

// Tipos para API responses
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Tipos para autenticação
export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Tipos para preferências do usuário
export interface UserPreferences {
  tom: 'formal' | 'informal' | 'técnico'
  nivelFormalidade: 'baixo' | 'médio' | 'alto'
  respostaComCitacoes: boolean
}

