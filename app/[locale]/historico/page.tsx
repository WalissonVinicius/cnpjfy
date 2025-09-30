'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  Search,
  Trash2,
  Download,
  Building2,
  Calendar,
  Filter
} from 'lucide-react'
import { formatDate, formatCNPJ } from '@/lib/utils'
import { getSearchHistory, clearSearchHistory } from '@/lib/storage'
import { useToast } from '@/components/ui/use-toast'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'

interface HistoryPageProps {
  params: { locale: string }
}

interface SearchHistoryItem {
  cnpj: string
  razaoSocial: string
  timestamp: number
  status?: string
}

export default function HistoryPage({ params }: HistoryPageProps) {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [filteredHistory, setFilteredHistory] = useState<SearchHistoryItem[]>([])
  const [searchFilter, setSearchFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { t } = useTranslation('history')

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    filterHistory()
  }, [searchFilter, searchHistory])

  const loadHistory = async () => {
    try {
      const history = await getSearchHistory()
      setSearchHistory(history)
      setIsLoading(false)
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
      setIsLoading(false)
    }
  }

  const filterHistory = () => {
    if (!searchFilter) {
      setFilteredHistory(searchHistory)
      return
    }

    const filtered = searchHistory.filter(item =>
      item.razaoSocial.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.cnpj.includes(searchFilter.replace(/\D/g, ''))
    )
    setFilteredHistory(filtered)
  }

  const handleClearHistory = async () => {
    try {
      await clearSearchHistory()
      setSearchHistory([])
      setFilteredHistory([])
      toast({
        title: t('historyCleared', 'Histórico limpo'),
        description: t('historyClearedDesc', 'Todo o histórico de pesquisas foi removido.'),
      })
    } catch (error) {
      toast({
        title: t('error', 'Erro'),
        description: t('clearHistoryError', 'Não foi possível limpar o histórico.'),
        variant: 'destructive',
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativa':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'suspensa':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'baixada':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-brand-600 via-purple-600 to-accent-500 bg-clip-text text-transparent px-2">
            {t('title', 'Histórico de Pesquisas')}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {t('description', 'Visualize e gerencie suas consultas anteriores com dados organizados e estatísticas detalhadas')}
          </p>

          {searchHistory.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={handleClearHistory}
                className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base bg-red-50 dark:bg-red-950/50 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/70 hover:border-red-300 dark:hover:border-red-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('clearHistory', 'Limpar Histórico')}
              </Button>
            </div>
          )}
        </div>

        {/* Search Filter */}
        {searchHistory.length > 0 && (
          <Card className="bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="relative flex-1 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-accent-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-500" />
                    <Input
                      placeholder={t('filterPlaceholder', 'Filtrar por empresa ou CNPJ...')}
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="pl-12 h-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-brand-200 dark:border-brand-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg transition-all duration-300"
                    />
                  </div>
                </div>
                <Button
                  className="h-12 px-6 bg-gradient-to-r from-brand-600 via-purple-600 to-accent-500 text-white dark:from-brand-500 dark:via-purple-500 dark:to-accent-400 shadow-lg hover:shadow-xl hover:brightness-110 rounded-xl font-semibold transition-all duration-300 hover:scale-105 focus-visible:ring-offset-2"
                >
                  <Filter className="h-4 w-4 mr-2 text-white" />
                  {t('filters', 'Filtros')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <Card className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center mb-6">
                <Clock className="h-10 w-10 text-brand-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                {searchHistory.length === 0 ? t('noSearches', 'Nenhuma pesquisa realizada') : t('noResults', 'Nenhum resultado encontrado')}
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
                {searchHistory.length === 0
                  ? t('noSearchesDesc', 'Suas consultas de CNPJ aparecerão aqui automaticamente.')
                  : t('noResultsDesc', 'Tente ajustar os filtros de pesquisa.')
                }
              </p>
              {searchHistory.length === 0 && (
                <Button
                  asChild
                  className="bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-700 hover:to-accent-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Link href={`/${params.locale}`}>
                    <Search className="h-5 w-5 mr-2" />
                    {t('firstSearch', 'Fazer primeira consulta')}
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredHistory.map((item, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                          {item.razaoSocial}
                        </h3>
                        <p className="text-sm text-muted-foreground font-mono mt-1">
                          CNPJ: {formatCNPJ(item.cnpj)}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Calendar className="h-4 w-4 text-brand-500" />
                          <span className="text-sm text-muted-foreground font-medium">
                            {formatDate(new Date(item.timestamp).toISOString())}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {item.status && (
                        <Badge className={`${getStatusColor(item.status)} px-3 py-1 font-semibold`}>
                          {item.status}
                        </Badge>
                      )}

                      <Button
                        asChild
                        size="sm"
                        className="h-10 px-4 bg-gradient-to-r from-brand-600 via-purple-600 to-accent-500 text-white dark:from-brand-500 dark:via-purple-500 dark:to-accent-400 shadow-md hover:shadow-lg hover:brightness-110 rounded-xl font-semibold transition-all duration-300 hover:scale-105 focus-visible:ring-offset-2"
                      >
                        <Link href={`/${params.locale}/empresa/${item.cnpj}`}>
                          {t('viewDetails', 'Ver Detalhes')}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {searchHistory.length > 0 && (
          <Card className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-brand-600 via-purple-600 to-accent-500 bg-clip-text text-transparent">
                {t('statistics', 'Estatísticas')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-brand-600 via-purple-600 to-accent-500 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  <div className="text-4xl font-bold tracking-tight text-white mb-3">
                    {searchHistory.length}
                  </div>
                  <div className="text-sm font-medium text-white/80">
                    {t('totalSearches', 'Total de Consultas')}
                  </div>
                </div>

                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                  <div className="text-4xl font-bold tracking-tight text-white mb-3">
                    {searchHistory.filter(item => item.status?.toLowerCase() === 'ativa').length}
                  </div>
                  <div className="text-sm font-medium text-white/80">
                    {t('activeCompanies', 'Empresas Ativas')}
                  </div>
                </div>

                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                  <div className="text-4xl font-bold tracking-tight text-white mb-3">
                    {searchHistory.filter(item => item.status?.toLowerCase() === 'suspensa').length}
                  </div>
                  <div className="text-sm font-medium text-white/80">
                    {t('suspended', 'Suspensas')}
                  </div>
                </div>

                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                  <div className="text-4xl font-bold tracking-tight text-white mb-3">
                    {searchHistory.filter(item => item.status?.toLowerCase() === 'baixada').length}
                  </div>
                  <div className="text-sm font-medium text-white/80">
                    {t('closed', 'Baixadas')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}



