import { useState, useEffect } from 'react'
import { acordaosService } from '@/services/acordaosService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, AlertTriangle, Zap, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'

export default function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalAcordaos: 0,
    coletasUltimas24h: 0,
    errosETL: 0,
    geracoesDia: 0,
    acordaosPorMes: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const recentActivities = [
  {
    id: 1,
    type: 'analise',
    description: 'Análise sobre "Direitos trabalhistas em home office"',
    time: '2 horas atrás',
  },
  {
    id: 2,
    type: 'peca',
    description: 'Petição inicial gerada para processo 1234567-89',
    time: '4 horas atrás',
  },
  {
    id: 3,
    type: 'coleta',
    description: 'ETL executado com sucesso - 45 novos acórdãos',
    time: '6 horas atrás',
  },
  {
    id: 4,
    type: 'chat',
    description: 'Consulta no JurisGênio sobre "Prescrição trabalhista"',
    time: '1 dia atrás',
  },
]

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      try {
        const statsResponse = await acordaosService.getDashboardStats()
        const errorStatsResponse = await acordaosService.getErrorStats()

        if (statsResponse.success && statsResponse.data && errorStatsResponse.success && errorStatsResponse.data) {
          setDashboardStats({
            totalAcordaos: statsResponse.data.total_acordaos || 0,
            coletasUltimas24h: statsResponse.data.coletas_ultimas_24h || 0, // Supondo que o backend forneça isso
            errosETL: errorStatsResponse.data.total_erros_nao_resolvidos || 0,
            geracoesDia: 0, // Ainda não implementado no backend
            acordaosPorMes: statsResponse.data.acordaos_por_mes || [],
          })
        } else {
          setError(statsResponse.error || errorStatsResponse.error || 'Erro ao carregar dados do dashboard')
          toast.error(statsResponse.error || errorStatsResponse.error || 'Erro ao carregar dados do dashboard')
        }
      } catch (err: any) {
        setError(err.message || 'Erro de rede ao carregar dados do dashboard')
        toast.error(err.message || 'Erro de rede ao carregar dados do dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas atividades jurídicas
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Acórdãos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "Carregando..." : dashboardStats.totalAcordaos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coletas 24h</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "Carregando..." : dashboardStats.coletasUltimas24h}</div>
            <p className="text-xs text-muted-foreground">
              Novos acórdãos coletados hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros ETL</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{loading ? "Carregando..." : dashboardStats.errosETL}</div>
            <p className="text-xs text-muted-foreground">
              Requer atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gerações Hoje</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "Carregando..." : dashboardStats.geracoesDia}</div>
            <p className="text-xs text-muted-foreground">
              Análises e peças geradas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de acórdãos por dia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Acórdãos por Dia
            </CardTitle>
            <CardDescription>
              Últimos 10 dias de coleta de acórdãos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardStats.acordaosPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes_ano" />
                <YAxis dataKey="total_acordaos" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="total_acordaos" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Atividades recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Suas últimas interações com o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === 'analise' && (
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                    )}
                    {activity.type === 'peca' && (
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                    )}
                    {activity.type === 'coleta' && (
                      <div className="h-2 w-2 rounded-full bg-orange-500 mt-2" />
                    )}
                    {activity.type === 'chat' && (
                      <div className="h-2 w-2 rounded-full bg-purple-500 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

