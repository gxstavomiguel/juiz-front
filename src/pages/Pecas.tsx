import { useState } from 'react'
import { FileText, Save, Download, Eye, EyeOff, Quote, Calendar, User } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
// import { Separator } from '../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import type { Peca } from '../types'

// Mock data para demonstração
const mockPecas: Peca[] = [
  {
    id: '1',
    tipo_peca: 'petição',
    situacao: 'Reclamação Trabalhista - Home Office',
    conteudo: `# PETIÇÃO INICIAL

## EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DO TRABALHO DA __ VARA DO TRABALHO DE SÃO PAULO

**JOÃO SILVA**, brasileiro, solteiro, advogado, inscrito na OAB/SP sob o nº 123.456, portador do RG nº 12.345.678-9 SSP/SP e CPF nº 123.456.789-00, residente e domiciliado na Rua das Flores, 123, São Paulo/SP, CEP 01234-567, vem, respeitosamente, à presença de Vossa Excelência, por meio de seu advogado que esta subscreve, propor a presente

## RECLAMAÇÃO TRABALHISTA

em face de **EMPRESA XYZ LTDA.**, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 12.345.678/0001-90, com sede na Avenida Paulista, 1000, São Paulo/SP, CEP 01310-100, pelos fatos e fundamentos jurídicos a seguir expostos:

### I - DOS FATOS

O Reclamante foi admitido pela Reclamada em 15/01/2020, para exercer a função de Analista de Sistemas, com salário de R$ 5.000,00 (cinco mil reais).

Em março de 2020, devido à pandemia de COVID-19, foi implementado o regime de trabalho remoto (home office), sem qualquer acordo formal ou aditivo contratual.

Durante todo o período de trabalho remoto, o Reclamante manteve sua jornada de trabalho normal, porém sem o devido controle de ponto, o que gerou horas extras não pagas.

### II - DO DIREITO

O trabalho em regime de home office está regulamentado pela Lei 14.442/2022, que alterou a CLT, estabelecendo que todos os direitos trabalhistas devem ser preservados.

Conforme jurisprudência consolidada do TST, o controle de jornada deve ser mantido mesmo no trabalho remoto, sendo devidas as horas extras quando comprovado o trabalho além da jornada normal.

### III - DOS PEDIDOS

Diante do exposto, requer-se:

a) O pagamento de horas extras realizadas durante o período de home office;
b) O reflexo das horas extras em 13º salário, férias e FGTS;
c) A condenação da Reclamada ao pagamento de custas processuais.

Dá-se à causa o valor de R$ 50.000,00.

Termos em que,
Pede deferimento.

São Paulo, 20 de agosto de 2024.

**[Nome do Advogado]**
OAB/SP nº 123.456`,
    referencias: [
      {
        processo: '1234567-89.2024.5.02.0001',
        url_completa: 'https://tst.jus.br/acordao/1234567',
        trechos_citados: ['Lei 14.442/2022', 'Trabalho remoto', 'Controle de jornada'],
      },
    ],
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2024-08-20'),
    userId: 'user1',
  },
]

export default function Pecas() {
  const [pecas] = useState<Peca[]>(mockPecas)
  const [tipoPeca, setTipoPeca] = useState('')
  const [situacao, setSituacao] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedPeca, setSelectedPeca] = useState<Peca | null>(null)
  const [showReferences, setShowReferences] = useState(false)

  const handleGenerate = async () => {
    if (!tipoPeca || !situacao) return

    setIsGenerating(true)
    
    // Simular geração de peça
    setTimeout(() => {
      const novaPeca = `# ${tipoPeca.toUpperCase()}

## SITUAÇÃO: ${situacao}

[Conteúdo da peça seria gerado aqui baseado na IA e nos acórdãos selecionados]

Esta é uma demonstração de como seria gerada uma peça processual automaticamente com base nos parâmetros fornecidos e na base de conhecimento de acórdãos.

Em produção, aqui seria integrada a API do OpenAI para gerar o conteúdo completo da peça.`

      setConteudo(novaPeca)
      setIsGenerating(false)
    }, 3000)
  }

  const handleSave = () => {
    console.log('Salvando peça:', { tipoPeca, situacao, conteudo })
  }

  const handleExportPDF = () => {
    console.log('Exportando para PDF')
  }

  const handleExportDOCX = () => {
    console.log('Exportando para DOCX')
  }

  const handleCiteAcordaos = () => {
    console.log('Abrindo modal para citar acórdãos')
  }

  const handleViewReferences = (peca: Peca) => {
    setSelectedPeca(peca)
    setShowReferences(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Peças Processuais</h1>
        <p className="text-muted-foreground">
          Gere e gerencie peças processuais com auxílio da IA
        </p>
      </div>

      <Tabs defaultValue="nova" className="space-y-6">
        <TabsList>
          <TabsTrigger value="nova">Nova Peça</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="nova" className="space-y-6">
          {/* Formulário de nova peça */}
          <Card>
            <CardHeader>
              <CardTitle>Gerar Nova Peça</CardTitle>
              <CardDescription>
                Configure os parâmetros para gerar uma peça processual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo_peca">Tipo de Peça</Label>
                  <Select value={tipoPeca} onValueChange={setTipoPeca}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petição">Petição Inicial</SelectItem>
                      <SelectItem value="contrarrazões">Contrarrazões</SelectItem>
                      <SelectItem value="agravo">Agravo de Instrumento</SelectItem>
                      <SelectItem value="recurso">Recurso Ordinário</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="situacao">Situação/Contexto</Label>
                  <Input
                    id="situacao"
                    placeholder="Ex: Reclamação trabalhista - horas extras"
                    value={situacao}
                    onChange={(e) => setSituacao(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleGenerate} disabled={isGenerating || !tipoPeca || !situacao}>
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Gerar Peça
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleCiteAcordaos}>
                  <Quote className="h-4 w-4 mr-2" />
                  Citar Acórdãos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Editor de peça */}
          {conteudo && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Editor de Peça</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Editar
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Visualizar
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportPDF}>
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportDOCX}>
                      <Download className="h-4 w-4 mr-1" />
                      DOCX
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {showPreview ? (
                  <div className="bg-white p-6 rounded-lg border min-h-96">
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {conteudo}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <Textarea
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value)}
                    className="min-h-96 font-mono text-sm"
                    placeholder="O conteúdo da peça aparecerá aqui..."
                  />
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          {/* Histórico de peças */}
          <Card>
            <CardHeader>
              <CardTitle>Peças Anteriores</CardTitle>
              <CardDescription>
                Histórico das suas peças processuais geradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pecas.map((peca) => (
                  <Card key={peca.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{peca.tipo_peca}</Badge>
                            <h3 className="font-semibold">{peca.situacao}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {peca.createdAt.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Você
                            </div>
                            <div className="flex items-center gap-1">
                              <Quote className="h-3 w-3" />
                              {peca.referencias.length} referência(s)
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewReferences(peca)}
                          >
                            <Quote className="h-3 w-3 mr-1" />
                            Referências
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Baixar
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-xs line-clamp-6">
                            {peca.conteudo}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de referências */}
      <Dialog open={showReferences} onOpenChange={setShowReferences}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Referências da Peça</DialogTitle>
            <DialogDescription>
              Acórdãos utilizados como base para esta peça processual
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPeca?.referencias.map((ref, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{ref.processo}</h4>
                      <Button size="sm" variant="outline" asChild>
                        <a href={ref.url_completa} target="_blank" rel="noopener noreferrer">
                          Ver Original
                        </a>
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Trechos citados:</p>
                      <div className="space-y-1">
                        {ref.trechos_citados.map((trecho, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {trecho}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

