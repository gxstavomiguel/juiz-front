# Guia de Integração Backend - JurisGênio MVP

## 🔗 Visão Geral

Este documento detalha como integrar o backend FastAPI com o frontend React do JurisGênio MVP.

## 🌐 Configuração de CORS

O backend deve permitir requisições do frontend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🔐 Autenticação

### Endpoints Esperados

```python
@app.post("/auth/login")
async def login(credentials: LoginCredentials):
    return {
        "token": "jwt_token_here",
        "user": {
            "id": "user_id",
            "email": "user@email.com",
            "name": "Nome do Usuário",
            "role": "advogado"  # advogado, juiz, promotor, analista
        }
    }

@app.post("/auth/refresh")
async def refresh_token():
    return {
        "token": "new_jwt_token",
        "user": {...}
    }
```

### Headers de Autenticação

O frontend enviará o token no header:
```
Authorization: Bearer <jwt_token>
```

## 📚 Endpoints de Acórdãos

### Listar Acórdãos
```python
@app.get("/acordaos")
async def get_acordaos(
    page: int = 1,
    limit: int = 10,
    processo: Optional[str] = None,
    orgao_judicante: Optional[str] = None,
    relator: Optional[str] = None,
    tipo_documento: Optional[str] = None,
    busca_texto: Optional[str] = None,
    data_inicio: Optional[str] = None,
    data_fim: Optional[str] = None
):
    return {
        "data": [...],  # Lista de acórdãos
        "total": 1000,
        "page": 1,
        "limit": 10,
        "totalPages": 100
    }
```

### Executar ETL
```python
@app.post("/acordaos/etl/run")
async def run_etl(params: ETLParams):
    return {
        "message": "ETL iniciado com sucesso",
        "job_id": "job_123"
    }
```

### Exportar Acórdãos
```python
@app.get("/acordaos/export")
async def export_acordaos(
    format: str = "xlsx",
    # ... outros filtros
):
    # Retornar arquivo para download
    return FileResponse(
        path="acordaos.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="acordaos.xlsx"
    )
```

### Estatísticas
```python
@app.get("/acordaos/stats")
async def get_acordaos_stats():
    return {
        "total": 15420,
        "ultimas24h": 127,
        "porOrgao": {
            "TST - 1ª Turma": 5000,
            "TST - 2ª Turma": 4500,
            # ...
        },
        "porTipo": {
            "Acórdão": 12000,
            "Decisão Monocrática": 3420
        }
    }
```

## 🤖 WebSocket para Chat

### Configuração do WebSocket
```python
@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket, token: str):
    await websocket.accept()
    
    # Criar thread para o usuário
    thread_id = create_openai_thread()
    
    # Enviar thread_id para o cliente
    await websocket.send_json({
        "type": "thread_id",
        "thread_id": thread_id
    })
    
    try:
        while True:
            data = await websocket.receive_json()
            
            if data["type"] == "user_message":
                # Processar mensagem do usuário
                response = await process_user_message(
                    thread_id=data["thread_id"],
                    content=data["content"],
                    attached_acordaos=data.get("attached_acordaos", []),
                    generate_peca=data.get("generate_peca", False)
                )
                
                # Enviar resposta
                await websocket.send_json({
                    "type": "message",
                    "id": response["id"],
                    "content": response["content"],
                    "role": "assistant",
                    "timestamp": response["timestamp"],
                    "references": response.get("references", [])
                })
                
    except WebSocketDisconnect:
        # Cleanup
        pass
```

### Endpoints de Conversas
```python
@app.get("/chat/conversations")
async def get_conversations():
    return [
        {
            "id": "conv_1",
            "title": "Direitos trabalhistas em home office",
            "created_at": "2024-08-20T10:00:00Z",
            "updated_at": "2024-08-20T10:30:00Z"
        }
    ]

@app.post("/chat/conversations")
async def create_conversation(data: dict):
    return {
        "id": "new_conv_id",
        "title": data["title"],
        "created_at": "2024-08-20T10:00:00Z"
    }
```

## 🔍 Endpoints de Análises

### Criar Análise
```python
@app.post("/analises")
async def create_analise(data: dict):
    return {
        "id": "analise_id",
        "pergunta": data["pergunta"],
        "filtros": data["filtros"],
        "resultado": "# Análise gerada...",
        "referencias": [...],
        "created_at": "2024-08-20T10:00:00Z",
        "status": "completed"
    }
```

### Listar Análises
```python
@app.get("/analises")
async def get_analises(page: int = 1, limit: int = 10):
    return {
        "data": [...],
        "total": 50,
        "page": 1,
        "limit": 10,
        "totalPages": 5
    }
```

### Exportar Análise
```python
@app.get("/analises/{analise_id}/export")
async def export_analise(analise_id: str, format: str = "pdf"):
    return FileResponse(
        path=f"analise_{analise_id}.{format}",
        filename=f"analise_{analise_id}.{format}"
    )
```

## 📝 Endpoints de Peças

### Gerar Peça
```python
@app.post("/pecas/generate")
async def generate_peca(data: dict):
    return {
        "id": "peca_id",
        "tipo_peca": data["tipo_peca"],
        "situacao": data["situacao"],
        "conteudo": "# Peça gerada...",
        "acordaos_referencia": data.get("acordaos_referencia", []),
        "created_at": "2024-08-20T10:00:00Z",
        "status": "completed"
    }
```

### Listar Peças
```python
@app.get("/pecas")
async def get_pecas(page: int = 1, limit: int = 10):
    return {
        "data": [...],
        "total": 30,
        "page": 1,
        "limit": 10,
        "totalPages": 3
    }
```

### Exportar Peça
```python
@app.get("/pecas/{peca_id}/export")
async def export_peca(peca_id: str, format: str = "pdf"):
    return FileResponse(
        path=f"peca_{peca_id}.{format}",
        filename=f"peca_{peca_id}.{format}"
    )
```

### Revisar Peça
```python
@app.post("/pecas/{peca_id}/review")
async def review_peca(peca_id: str, data: dict):
    return {
        "sugestoes": [
            "Adicionar fundamentação legal",
            "Melhorar argumentação"
        ],
        "pecaRevisada": "# Peça revisada..."
    }
```

## 📊 Modelos de Dados

### Acórdão
```python
class Acordao(BaseModel):
    id: str
    processo: str
    orgao_judicante: str
    relator: str
    julgamento: str
    publicacao: str
    tipo_documento: str
    url_completa: str
    data_extracao: str
    inteiro_teor: str
```

### Análise
```python
class Analise(BaseModel):
    id: str
    pergunta: str
    filtros: dict
    resultado: str
    referencias: List[dict]
    created_at: datetime
    status: str
```

### Peça
```python
class Peca(BaseModel):
    id: str
    tipo_peca: str
    situacao: str
    conteudo: str
    acordaos_referencia: List[str]
    created_at: datetime
    status: str
```

## 🔄 Tratamento de Erros

### Formato de Erro Padrão
```python
from fastapi import HTTPException

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "message": "Erro interno do servidor",
            "detail": str(exc) if DEBUG else None
        }
    )

# Erro de validação
raise HTTPException(
    status_code=400,
    detail="Dados inválidos"
)

# Erro de autenticação
raise HTTPException(
    status_code=401,
    detail="Token inválido"
)
```

## 🚀 Configuração de Desenvolvimento

### Variáveis de Ambiente
```env
# .env
DATABASE_URL=postgresql://user:pass@localhost/jurisgenio
OPENAI_API_KEY=sk-...
JWT_SECRET_KEY=your-secret-key
DEBUG=True
CORS_ORIGINS=["http://localhost:5173"]
```

### Comando para Iniciar
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📝 Logs e Monitoramento

### Estrutura de Logs
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.4f}s"
    )
    
    return response
```

## 🧪 Testes de Integração

### Exemplo de Teste
```python
import pytest
from fastapi.testclient import TestClient

def test_get_acordaos():
    response = client.get("/acordaos?page=1&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "total" in data
    assert "page" in data
```

## 📋 Checklist de Implementação

- [ ] Configurar CORS
- [ ] Implementar autenticação JWT
- [ ] Criar endpoints de acórdãos
- [ ] Implementar WebSocket para chat
- [ ] Criar endpoints de análises
- [ ] Criar endpoints de peças
- [ ] Configurar exportação de arquivos
- [ ] Implementar tratamento de erros
- [ ] Adicionar logs
- [ ] Criar testes de integração
- [ ] Documentar API com OpenAPI/Swagger

---

Este guia garante que o backend esteja totalmente compatível com o frontend React implementado.

