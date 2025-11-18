import { useState } from 'react'
import { Search, Save, FileText } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'

export default function AnalisesSimple() {
  const [pergunta, setPergunta] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = () => {
    if (!pergunta.trim()) return
    
    setIsAnalyzing(true)
    // Simular análise
    setTimeout(() => {
      setIsAnalyzing(false)
      setPergunta('')
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Análises</h1>
        <p className="text-muted-foreground">
          Faça perguntas específicas sobre acórdãos e receba análises detalhadas
        </p>
      </div>

      {/* Formulário de nova análise */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Análise</CardTitle>
          <CardDescription>
            Formule uma pergunta para analisar acórdãos específicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pergunta">Pergunta</Label>
            <Textarea
              id="pergunta"
              placeholder="Ex: Quais são os principais entendimentos sobre trabalho em home office?"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleAnalyze} 
              disabled={!pergunta.trim() || isAnalyzing}
              className="flex-1"
            >
              <Search className="mr-2 h-4 w-4" />
              {isAnalyzing ? 'Analisando...' : 'Analisar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de análises anteriores */}
      <Card>
        <CardHeader>
          <CardTitle>Análises Anteriores</CardTitle>
          <CardDescription>
            Suas análises jurídicas realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">Trabalho em Home Office</h3>
                <Badge variant="secondary">Concluída</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Quais são os principais entendimentos sobre trabalho em home office?
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Análise
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">Horas Extras</h3>
                <Badge variant="secondary">Concluída</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Como calcular horas extras em regime de trabalho híbrido?
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Análise
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




