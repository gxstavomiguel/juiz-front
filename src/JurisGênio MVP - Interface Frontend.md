# JurisGênio MVP - Interface Frontend

## 📋 Descrição

Interface frontend completa para o sistema JurisGênio, um assistente jurídico inteligente que permite aos usuários (advogados, juízes, promotores e analistas) interagir com IA, buscar acórdãos do TST, realizar análises jurídicas e gerar peças processuais.

## 🚀 Tecnologias Utilizadas

- **React 18** com TypeScript
- **TailwindCSS** para estilização
- **shadcn/ui** para componentes de interface
- **Lucide React** para ícones
- **Recharts** para gráficos
- **Axios** para requisições HTTP
- **React Router** para navegação
- **Next Themes** para alternância de tema

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base do shadcn/ui
│   ├── Layout.tsx      # Layout principal da aplicação
│   ├── AppSidebar.tsx  # Barra lateral de navegação
│   └── Header.tsx      # Cabeçalho com informações do usuário
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── hooks/              # Hooks customizados
│   ├── useApi.ts       # Hook para requisições API
│   └── useChat.ts      # Hook para chat/WebSocket
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx   # Página inicial com estatísticas
│   ├── JurisGenio.tsx  # Chat com assistente IA
│   ├── Acordaos.tsx    # Busca e listagem de acórdãos
│   ├── Analises.tsx    # Análises jurídicas
│   ├── Pecas.tsx       # Geração de peças processuais
│   └── Login.tsx       # Página de autenticação
├── services/           # Serviços para integração com APIs
│   ├── api.ts          # Cliente HTTP base
│   ├── authService.ts  # Serviços de autenticação
│   ├── acordaosService.ts # Serviços de acórdãos
│   ├── chatService.ts  # Serviços de chat/WebSocket
│   ├── analisesService.ts # Serviços de análises
│   └── pecasService.ts # Serviços de peças
├── types/              # Definições de tipos TypeScript
│   └── index.ts        # Tipos principais da aplicação
├── utils/              # Funções utilitárias
│   └── index.ts        # Utilitários diversos
└── App.tsx             # Componente principal
```

## 🎯 Funcionalidades Implementadas

### 🔐 Autenticação
- Sistema de login com validação
- Contexto de autenticação global
- Proteção de rotas
- Logout automático

### 📊 Dashboard
- Cards com estatísticas principais
- Gráfico de acórdãos por dia
- Lista de atividades recentes
- Indicadores de performance

### 🤖 JurisGênio (Chat)
- Interface de chat com histórico
- Anexar acórdãos às conversas
- Geração de peças via chat
- Toggle para respostas com citações
- Conexão via WebSocket (preparado)

### 📚 Acórdãos
- Busca com múltiplos filtros
- Listagem paginada
- Exportação para CSV/XLSX
- Execução de ETL para coleta
- Visualização detalhada

### 🔍 Análises
- Formulário para perguntas jurídicas
- Configuração de filtros de acórdãos
- Resultados em Markdown
- Sistema de referências
- Salvamento de análises

### 📝 Peças Processuais
- Seleção de tipo de peça
- Geração com IA
- Editor com pré-visualização
- Citação de acórdãos
- Exportação para PDF/DOCX

### 🎨 Interface
- Design responsivo
- Tema claro/escuro
- Sidebar colapsível
- Componentes acessíveis
- Feedback visual de estados

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- npm ou pnpm

### Instalação
```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd jurisgenio-mvp

# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm run dev
```

### Variáveis de Ambiente
```env
# API Backend (padrão: localhost:8000)
VITE_API_BASE_URL=http://localhost:8000

# WebSocket URL (padrão: localhost:8000)
VITE_WS_URL=ws://localhost:8000
```

## 🔌 Integração com Backend

### APIs Implementadas

#### Autenticação
- `POST /auth/login` - Login do usuário
- `POST /auth/refresh` - Renovação de token

#### Acórdãos
- `GET /acordaos` - Listar acórdãos com filtros
- `GET /acordaos/{id}` - Obter acórdão específico
- `POST /acordaos/etl/run` - Executar ETL
- `GET /acordaos/export` - Exportar acórdãos
- `GET /acordaos/stats` - Estatísticas

#### Chat/JurisGênio
- `WebSocket /ws/chat` - Conexão de chat
- `GET /chat/conversations` - Listar conversas
- `POST /chat/conversations` - Criar conversa

#### Análises
- `POST /analises` - Criar análise
- `GET /analises` - Listar análises
- `GET /analises/{id}` - Obter análise
- `GET /analises/{id}/export` - Exportar análise

#### Peças
- `POST /pecas/generate` - Gerar peça
- `GET /pecas` - Listar peças
- `GET /pecas/{id}/export` - Exportar peça
- `POST /pecas/{id}/review` - Revisar peça

### Formato de Dados

#### Usuário
```typescript
interface User {
  id: string
  email: string
  name: string
  role: 'advogado' | 'juiz' | 'promotor' | 'analista'
  avatar?: string
}
```

#### Acórdão
```typescript
interface Acordao {
  id: string
  processo: string
  orgao_judicante: string
  relator: string
  julgamento: string
  publicacao: string
  tipo_documento: string
  url_completa: string
  data_extracao: string
  inteiro_teor: string
}
```

## 🎨 Customização de Tema

O projeto utiliza CSS Variables para temas:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... outras variáveis */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... outras variáveis */
}
```

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Sidebar**: Colapsível em telas menores
- **Tabelas**: Scroll horizontal quando necessário

## 🔒 Segurança

- Validação de formulários
- Sanitização de dados
- Proteção contra XSS
- Tokens JWT para autenticação
- Interceptors para renovação automática

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Executar testes com coverage
pnpm test:coverage

# Executar testes em modo watch
pnpm test:watch
```

## 📦 Build e Deploy

```bash
# Build para produção
pnpm build

# Preview do build
pnpm preview

# Deploy (configurar conforme plataforma)
pnpm deploy
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

- **Frontend**: Interface React com TypeScript
- **Backend**: API FastAPI (separado)
- **IA**: Integração com OpenAI GPT

## 📞 Suporte

Para suporte e dúvidas:
- Email: suporte@jurisgenio.com
- Documentação: [docs.jurisgenio.com](https://docs.jurisgenio.com)
- Issues: [GitHub Issues](https://github.com/jurisgenio/mvp/issues)

---

**JurisGênio MVP** - Assistente Jurídico Inteligente 🏛️⚖️

