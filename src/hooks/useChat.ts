import { useState, useEffect, useCallback } from 'react'
import { chatService } from '@/services/chatService'
import type { ChatMessage } from '@/types'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Handler para novas mensagens
  const handleMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message])
    setIsLoading(false)
  }, [])

  // Handler para status de conexão
  const handleConnection = useCallback((connected: boolean) => {
    setIsConnected(connected)
  }, [])

  useEffect(() => {
    // Conectar ao WebSocket quando o componente monta
    chatService.connect()
    
    // Adicionar handlers
    chatService.onMessage(handleMessage)
    chatService.onConnection(handleConnection)

    // Cleanup quando o componente desmonta
    return () => {
      chatService.offMessage(handleMessage)
      chatService.offConnection(handleConnection)
      chatService.disconnect()
    }
  }, [handleMessage, handleConnection])

  const sendMessage = useCallback((
    content: string, 
    attachedAcordaos: string[] = [], 
    generatePeca: boolean = false
  ) => {
    if (!isConnected) {
      throw new Error('Chat não conectado')
    }

    // Adicionar mensagem do usuário imediatamente
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Enviar mensagem via WebSocket
    chatService.sendMessage(content, attachedAcordaos, generatePeca)
  }, [isConnected])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const reconnect = useCallback(() => {
    chatService.disconnect()
    chatService.connect()
  }, [])

  return {
    messages,
    isConnected,
    isLoading,
    sendMessage,
    clearMessages,
    reconnect,
  }
}

