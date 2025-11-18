import { apiRequest } from './api'
import type { ChatMessage, ChatConversation } from '@/types'

export class ChatService {
  private ws: WebSocket | null = null
  private threadId: string | null = null
  private messageHandlers: ((message: ChatMessage) => void)[] = []
  private connectionHandlers: ((connected: boolean) => void)[] = []

  // Conectar ao WebSocket
  connect() {
    const token = localStorage.getItem('auth_token')
    const wsUrl = `ws://localhost:8000/ws/chat?token=${token}`
    
    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      console.log('WebSocket conectado')
      this.connectionHandlers.forEach(handler => handler(true))
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'thread_id') {
        this.threadId = data.thread_id
      } else if (data.type === 'message') {
        const message: ChatMessage = {
          id: data.id,
          content: data.content,
          role: data.role,
          timestamp: new Date(data.timestamp),
          references: data.references,
        }
        this.messageHandlers.forEach(handler => handler(message))
      }
    }

    this.ws.onclose = () => {
      console.log('WebSocket desconectado')
      this.connectionHandlers.forEach(handler => handler(false))
    }

    this.ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error)
    }
  }

  // Desconectar WebSocket
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      this.threadId = null
    }
  }

  // Enviar mensagem
  sendMessage(content: string, attachedAcordaos: string[] = [], generatePeca: boolean = false) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket não conectado')
    }

    const message = {
      type: 'user_message',
      thread_id: this.threadId,
      content,
      attached_acordaos: attachedAcordaos,
      generate_peca: generatePeca,
    }

    this.ws.send(JSON.stringify(message))
  }

  // Adicionar handler para mensagens
  onMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers.push(handler)
  }

  // Remover handler de mensagens
  offMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler)
  }

  // Adicionar handler para conexão
  onConnection(handler: (connected: boolean) => void) {
    this.connectionHandlers.push(handler)
  }

  // Remover handler de conexão
  offConnection(handler: (connected: boolean) => void) {
    this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler)
  }

  // Verificar se está conectado
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Instância singleton do serviço de chat
export const chatService = new ChatService()

// Serviços HTTP para conversas
export const conversationService = {
  // Listar conversas
  async getConversations() {
    return apiRequest<ChatConversation[]>('GET', '/chat/conversations')
  },

  // Obter conversa por ID
  async getConversation(id: string) {
    return apiRequest<ChatConversation>('GET', `/chat/conversations/${id}`)
  },

  // Criar nova conversa
  async createConversation(title: string) {
    return apiRequest<ChatConversation>('POST', '/chat/conversations', { title })
  },

  // Deletar conversa
  async deleteConversation(id: string) {
    return apiRequest<{ success: boolean }>('DELETE', `/chat/conversations/${id}`)
  },

  // Atualizar título da conversa
  async updateConversationTitle(id: string, title: string) {
    return apiRequest<ChatConversation>('PUT', `/chat/conversations/${id}`, { title })
  },
}

