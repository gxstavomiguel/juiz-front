# Guia de Deployment - JurisGênio MVP

## 🚀 Visão Geral

Este documento detalha como fazer o deploy do frontend React do JurisGênio MVP em diferentes ambientes.

## 🏗️ Build para Produção

### Preparação
```bash
# Instalar dependências
pnpm install

# Executar testes
pnpm test

# Build para produção
pnpm build
```

### Configuração de Ambiente
```env
# .env.production
VITE_API_BASE_URL=https://api.jurisgenio.com
VITE_WS_URL=wss://api.jurisgenio.com
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

## 🌐 Deploy em Vercel

### Configuração
```json
// vercel.json
{
  "framework": "vite",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev",
  "env": {
    "VITE_API_BASE_URL": "@api-base-url",
    "VITE_WS_URL": "@ws-url"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Deploy
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🐳 Deploy com Docker

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar package files
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm
RUN npm install -g pnpm

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copiar build para nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
}
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=https://api.jurisgenio.com
      - VITE_WS_URL=wss://api.jurisgenio.com
    restart: unless-stopped

  # Se incluir backend no mesmo compose
  backend:
    image: jurisgenio/backend:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/jurisgenio
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=jurisgenio
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

## ☁️ Deploy na AWS

### S3 + CloudFront
```bash
# Build da aplicação
pnpm build

# Upload para S3
aws s3 sync dist/ s3://jurisgenio-frontend --delete

# Invalidar cache do CloudFront
aws cloudfront create-invalidation --distribution-id E1234567890 --paths "/*"
```

### GitHub Actions para AWS
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
      
    - name: Run tests
      run: pnpm test
      
    - name: Build
      run: pnpm build
      env:
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
        VITE_WS_URL: ${{ secrets.WS_URL }}
        
    - name: Deploy to S3
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
        
    - name: Sync to S3
      run: aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete
      
    - name: Invalidate CloudFront
      run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

## 🔧 Configurações de Produção

### Otimizações de Build
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    // Otimizações para produção
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: true,
  },
})
```

### Variáveis de Ambiente por Ambiente
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_ENVIRONMENT=development

# .env.staging
VITE_API_BASE_URL=https://staging-api.jurisgenio.com
VITE_WS_URL=wss://staging-api.jurisgenio.com
VITE_ENVIRONMENT=staging

# .env.production
VITE_API_BASE_URL=https://api.jurisgenio.com
VITE_WS_URL=wss://api.jurisgenio.com
VITE_ENVIRONMENT=production
```

## 📊 Monitoramento

### Sentry para Error Tracking
```typescript
// src/main.tsx
import * as Sentry from "@sentry/react"

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_ENVIRONMENT,
    tracesSampleRate: 0.1,
  })
}
```

### Google Analytics
```typescript
// src/utils/analytics.ts
import { gtag } from 'ga-gtag'

export const trackEvent = (action: string, category: string, label?: string) => {
  if (import.meta.env.PROD) {
    gtag('event', action, {
      event_category: category,
      event_label: label,
    })
  }
}
```

## 🔒 Segurança

### Content Security Policy
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.jurisgenio.com wss://api.jurisgenio.com;
  font-src 'self';
">
```

### Headers de Segurança (nginx)
```nginx
# Adicionar ao nginx.conf
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## 🚨 Rollback

### Estratégia de Rollback
```bash
# Manter versões anteriores
aws s3 sync s3://jurisgenio-frontend s3://jurisgenio-frontend-backup-$(date +%Y%m%d)

# Em caso de problema, restaurar versão anterior
aws s3 sync s3://jurisgenio-frontend-backup-20240820 s3://jurisgenio-frontend --delete
aws cloudfront create-invalidation --distribution-id E1234567890 --paths "/*"
```

## 📋 Checklist de Deploy

### Pré-Deploy
- [ ] Testes passando
- [ ] Build sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Backup da versão atual
- [ ] Documentação atualizada

### Deploy
- [ ] Build da aplicação
- [ ] Upload dos arquivos
- [ ] Configuração do servidor web
- [ ] Teste de funcionalidades críticas
- [ ] Verificação de performance

### Pós-Deploy
- [ ] Monitoramento de erros
- [ ] Verificação de métricas
- [ ] Teste de integração com backend
- [ ] Comunicação para stakeholders
- [ ] Documentação de mudanças

## 🔄 CI/CD Pipeline

### Exemplo Completo
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Staging
        run: |
          # Deploy para ambiente de staging
          
  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Production
        run: |
          # Deploy para produção
```

---

Este guia garante um deploy seguro e eficiente do JurisGênio MVP em qualquer ambiente.

