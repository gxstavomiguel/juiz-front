import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, FileText, ToggleLeft, ToggleRight, Plus, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { ChatMessage, ChatConversation } from '@/types'

// Mock data para demonstração
const mockConversations: ChatConversation[] = [
  {
    id: '1',
    title: 'Direitos trabalhistas em home office',
    messages: [],
    createdAt: new Date('2024-08-19'),
    updatedAt: new Date('2024-08-19'),
  },
  {
    id: '2',
    title: 'Prescrição em processos trabalhistas',
    messages: [],
    createdAt: new Date('2024-08-18'),
    updatedAt: new Date('2024-08-18'),
  },
  {
    id: '3',
    title: 'Cálculo de horas extras',
    messages: [],
    createdAt: new Date('2024-08-17'),
    updatedAt: new Date('2024-08-17'),
  },
]

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Olá! Como posso ajudá-lo com questões jurídicas hoje?',
    role: 'assistant',
    timestamp: new Date('2024-08-20T10:00:00'),
  },
  {
    id: '2',
    content: 'Preciso de informações sobre direitos trabalhistas em regime de home office.',
    role: 'user',
    timestamp: new Date('2024-08-20T10:01:00'),
  },
  {
    id: '3',
    content: 'Claro! O trabalho em home office está regulamentado pela Lei 14.442/2022, que alterou a CLT. Os principais pontos são:\n\n1. **Acordo mútuo**: O trabalho remoto deve ser estabelecido por acordo entre empregador e empregado\n2. **Equipamentos**: O empregador deve fornecer os equipamentos necessários\n3. **Controle de jornada**: Mantém-se o controle de horário quando aplicável\n4. **Direitos preservados**: Todos os direitos trabalhistas são mantidos\n\nGostaria que eu detalhe algum aspecto específico?',
    role: 'assistant',
    timestamp: new Date('2024-08-20T10:02:00'),
    references: [
      {
        processo: 'Lei 14.442/2022',
        url_completa: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/L14442.htm',
        trechos_citados: ['Art. 75-A', 'Art. 75-B'],
      },
    ],
  },
]

export default function JurisGenio() {
  const [currentConversation, setCurrentConversation] = useState<string>('1')
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [respostaComCitacoes, setRespostaComCitacoes] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Esta é uma resposta simulada do JurisGênio. Em produção, aqui seria integrada a API do OpenAI para gerar respostas jurídicas inteligentes baseadas na base de acórdãos.',
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const startNewConversation = () => {
    setMessages([
      {
        id: '1',
        content: 'Olá! Como posso ajudá-lo com questões jurídicas hoje?',
        role: 'assistant',
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar com histórico de conversas */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Conversas</CardTitle>
            <Button size="sm" onClick={startNewConversation}>
              <Plus className="h-4 w-4 mr-1" />
              Nova
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full px-4">
            <div className="space-y-2">
              {mockConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentConversation === conversation.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setCurrentConversation(conversation.id)}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {conversation.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Área principal do chat */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">JurisGênio</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Resposta com citações</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRespostaComCitacoes(!respostaComCitacoes)}
                  className="p-0 h-auto"
                >
                  {respostaComCitacoes ? (
                    <ToggleRight className="h-5 w-5 text-primary" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Área de mensagens */}
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        JG
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {message.references && message.references.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/20">
                        <p className="text-xs font-medium mb-2">Referências:</p>
                        <div className="space-y-1">
                          {message.references.map((ref, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {ref.processo}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      JG
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <Separator />

          {/* Área de input */}
          <div className="p-4">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <FileText className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Digite sua pergunta jurídica..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
              </div>
              <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm">
                Anexar Acórdãos
              </Button>
              <Button variant="outline" size="sm">
                Gerar Peça
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

