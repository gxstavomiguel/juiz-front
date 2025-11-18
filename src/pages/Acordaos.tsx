import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Eye, Brain, Plus, Download, Play, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination'
import { acordaosService } from '@/services/acordaosService'
import type { Acordao, AcordaoFilters, ETLParams } from '@/types'
import { toast } from 'sonner'

export default function Acordaos() {
  const [acordaos, setAcordaos] = useState<Acordao[]>([])
  const [totalAcordaos, setTotalAcordaos] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10) // Mantendo o tamanho da página fixo por enquanto
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<AcordaoFilters>({
    page: 1,
    limit: 10,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAcordao, setSelectedAcordao] = useState<Acordao | null>(null)
  const [showETLDialog, setShowETLDialog] = useState(false)
  const [etlParams, setEtlParams] = useState<ETLParams>({})
  const [etlRunning, setEtlRunning] = useState(false)
  const [etlProcessId, setEtlProcessId] = useState<string | null>(null)
  const [etlProgress, setEtlProgress] = useState<any>(null)

  const fetchAcordaos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await acordaosService.getAcordaos(filtros)
      if (response.success && response.data) {
        setAcordaos(response.data.items)
        setTotalAcordaos(response.data.total)
        setCurrentPage(response.data.page)
      } else {
        setError(response.error || 'Erro ao buscar acórdãos')
        toast.error(response.error || 'Erro ao buscar acórdãos')
      }
    } catch (err: any) {
      setError(err.message || 'Erro de rede ao buscar acórdãos')
      toast.error(err.message || 'Erro de rede ao buscar acórdãos')
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    fetchAcordaos()
  }, [fetchAcordaos])

  const handleFilterChange = (key: keyof AcordaoFilters, value: any) => {
    setFiltros(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFiltros(prev => ({ ...prev, page }))
  }

  const handleETLParamChange = (key: keyof ETLParams, value: any) => {
    setEtlParams(prev => ({ ...prev, [key]: value }))
  }

  const handleRunETL = async () => {
    if (!etlParams.dataInicio || !etlParams.dataFim) {
      toast.error('Por favor, preencha as datas de início e fim para o ETL.')
      return
    }
    setEtlRunning(true)
    setShowETLDialog(false)
    toast.info('Iniciando processo de ETL...')
    try {
      const response = await acordaosService.runETL(etlParams)
      if (response.success && response.data) {
        setEtlProcessId(response.data.processo_id)
        toast.success(`ETL iniciado! ID do Processo: ${response.data.processo_id}`)
        // Iniciar monitoramento WebSocket
        const ws = new WebSocket(`ws://localhost:8000/api/v1/acordaos/etl/progress/${response.data.processo_id}`)
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data)
          if (data.tipo === 'progress_update') {
            setEtlProgress(data.data)
            if (data.data.status === 'concluido') {
              toast.success('Extração de acórdãos concluída!')
              setEtlRunning(false)
              setEtlProcessId(null)
              setEtlProgress(null)
              fetchAcordaos() // Recarregar dados após ETL
            } else if (data.data.status === 'erro') {
              toast.error(`Erro na extração: ${data.data.mensagem_erro}`)
              setEtlRunning(false)
              setEtlProcessId(null)
              setEtlProgress(null)
            }
          }
        }
        ws.onclose = () => {
          console.log('WebSocket fechado.')
          if (etlRunning) {
            toast.info('Monitoramento de ETL encerrado. Verifique o status manualmente se necessário.')
          }
        }
        ws.onerror = (err) => {
          console.error('Erro no WebSocket:', err)
          toast.error('Erro na conexão WebSocket para monitoramento de ETL.')
        }
      } else {
        toast.error(response.error || 'Erro ao iniciar ETL')
        setEtlRunning(false)
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro de rede ao iniciar ETL')
      setEtlRunning(false)
    }
  }

  const handleViewAcordao = (acordao: Acordao) => {
    setSelectedAcordao(acordao)
  }

  const handleAnalyzeAcordao = (acordao: Acordao) => {
    console.log('Analisando acórdão:', acordao.processo)
    toast.info(`Analisando acórdão: ${acordao.processo}`)
  }

  const handleAddToContext = (acordao: Acordao) => {
    console.log('Adicionando ao contexto:', acordao.processo)
    toast.info(`Adicionando ao contexto: ${acordao.processo}`)
  }

  const totalPages = Math.ceil(totalAcordaos / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Acórdãos</h1>
          <p className="text-muted-foreground">
            Busque e gerencie acórdãos do TST
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showETLDialog} onOpenChange={setShowETLDialog}>
            <DialogTrigger asChild>
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Executar ETL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Executar ETL - Coleta de Acórdãos</DialogTitle>
                <DialogDescription>
                  Configure os parâmetros para buscar novos acórdãos no TST
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataInicio">Data Início</Label>
                    <Input
                      type="date"
                      id="dataInicio"
                      value={etlParams.dataInicio || ''}
                      onChange={(e) => handleETLParamChange("dataInicio", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataFim">Data Fim</Label>
                    <Input
                      type="date"
                      id="dataFim"
                      value={etlParams.dataFim || ''}
                      onChange={(e) => handleETLParamChange("dataFim", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="orgaoJudicante">Órgão Julgador</Label>
                  <Select
                    value={etlParams.orgaoJudicante || ''}
                    onValueChange={(value) => handleETLParamChange("orgaoJudicante", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o órgão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="TST - 1ª Turma">TST - 1ª Turma</SelectItem>
                      <SelectItem value="TST - 2ª Turma">TST - 2ª Turma</SelectItem>
                      <SelectItem value="TST - 3ª Turma">TST - 3ª Turma</SelectItem>
                      <SelectItem value="TST - SDC">TST - SDC</SelectItem>
                      <SelectItem value="TST - SDI-1">TST - SDI-1</SelectItem>
                      <SelectItem value="TST - SDI-2">TST - SDI-2</SelectItem>
                      <SelectItem value="TST - Pleno">TST - Pleno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                  <Select
                    value={etlParams.tipoDocumento || ''}
                    onValueChange={(value) => handleETLParamChange("tipoDocumento", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="Acórdão">Acórdão</SelectItem>
                      <SelectItem value="Decisão Monocrática">Decisão Monocrática</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {etlRunning && etlProcessId && (
                  <div className="mt-4 p-4 border rounded-md bg-blue-50">
                    <p className="text-sm font-medium text-blue-700">ETL em andamento (ID: {etlProcessId})</p>
                    {etlProgress ? (
                      <p className="text-xs text-blue-600">
                        Processados: {etlProgress.total_processados} / {etlProgress.total_encontrados} |
                        Inseridos: {etlProgress.total_inseridos} |
                        Duplicados: {etlProgress.total_duplicados} |
                        Erros: {etlProgress.total_erros}
                      </p>
                    ) : (
                      <p className="text-xs text-blue-600">Aguardando progresso...</p>
                    )}
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowETLDialog(false)} disabled={etlRunning}>
                    Cancelar
                  </Button>
                  <Button onClick={handleRunETL} disabled={etlRunning}>
                    {etlRunning ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {etlRunning ? 'Executando...' : 'Executar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filtros</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por texto livre..." 
                value={filtros.busca_texto || ''}
                onChange={(e) => handleFilterChange('busca_texto', e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={fetchAcordaos} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              Buscar
            </Button>
          </div>

          {showFilters && (
            <>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="processo">Processo</Label>
                  <Input
                    id="processo"
                    placeholder="Número do processo"
                    value={filtros.processo || ''}
                    onChange={(e) => handleFilterChange('processo', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="orgao">Órgão Julgador</Label>
                  <Select
                    value={filtros.orgao_judicante || ''}
                    onValueChange={(value) => handleFilterChange('orgao_judicante', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="TST - 1ª Turma">TST - 1ª Turma</SelectItem>
                      <SelectItem value="TST - 2ª Turma">TST - 2ª Turma</SelectItem>
                      <SelectItem value="TST - 3ª Turma">TST - 3ª Turma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="relator">Relator</Label>
                  <Input
                    id="relator"
                    placeholder="Nome do relator"
                    value={filtros.relator || ''}
                    onChange={(e) => handleFilterChange('relator', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo de Documento</Label>
                  <Select
                    value={filtros.tipo_documento || ''}
                    onValueChange={(value) => handleFilterChange('tipo_documento', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="Acórdão">Acórdão</SelectItem>
                      <SelectItem value="Decisão Monocrática">Decisão Monocrática</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Tabela de resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados ({acordaos.length})</CardTitle>
          <CardDescription>
            Lista de acórdãos encontrados com base nos filtros aplicados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Processo</TableHead>
                <TableHead>Órgão</TableHead>
                <TableHead>Relator</TableHead>
                <TableHead>Julgamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acordaos.map((acordao) => (
                <TableRow key={acordao.id}>
                  <TableCell className="font-mono text-sm">
                    {acordao.processo}
                  </TableCell>
                  <TableCell>{acordao.orgao_judicante}</TableCell>
                  <TableCell>{acordao.relator}</TableCell>
                  <TableCell>
                    {acordao.julgamento ? new Date(acordao.julgamento).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{acordao.tipo_documento}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewAcordao(acordao)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAnalyzeAcordao(acordao)}
                      >
                        <Brain className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToContext(acordao)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {acordaos.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum acórdão encontrado com os filtros aplicados.
            </div>
          )}

          {loading && (
            <div className="text-center py-8 text-muted-foreground flex items-center justify-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Carregando acórdãos...
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-500 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 mr-2" /> {error}
            </div>
          )}

          {/* Paginação */}
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={() => handlePageChange(page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para visualização do acórdão */}
      <Dialog open={!!selectedAcordao} onOpenChange={() => setSelectedAcordao(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAcordao?.processo}</DialogTitle>
            <DialogDescription>
              Detalhes do Acórdão
            </DialogDescription>
          </DialogHeader>
          {selectedAcordao && (
            <div className="space-y-4 text-sm">
              <p><strong>Órgão Julgador:</strong> {selectedAcordao.orgao_judicante}</p>
              <p><strong>Relator:</strong> {selectedAcordao.relator}</p>
              <p><strong>Data de Julgamento:</strong> {selectedAcordao.julgamento ? new Date(selectedAcordao.julgamento).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Tipo de Documento:</strong> {selectedAcordao.tipo_documento}</p>
              <p><strong>Ementa:</strong></p>
              <div className="border p-3 rounded-md bg-gray-50 whitespace-pre-wrap text-black">
                {selectedAcordao.ementa}
              </div>
              <p><strong>Inteiro Teor:</strong></p>
              <div className="border p-3 rounded-md bg-gray-50 whitespace-pre-wrap max-h-96 overflow-y-auto text-black">
                {selectedAcordao.inteiro_teor}
              </div>
              {selectedAcordao.url_completa && (
                <p>
                  <strong>Link:</strong> <a href={selectedAcordao.url_completa} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Abrir Documento Original</a>
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
};

