'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  X,
  Search,
  Building2,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react'
import { cnpjMask, cnpjClean, isValidCnpj } from '@/lib/cnpj'
import { formatCurrency, formatDate, formatCNPJ } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { useTranslation } from '@/lib/i18n'
import { Company } from '@/lib/api'
import {
  getComparisonCompanies,
  addComparisonCompany,
  removeComparisonCompany,
  type ComparisonCompany
} from '@/lib/storage'

interface ComparePageProps {
  params: { locale: string }
}

export default function ComparePage({ params }: ComparePageProps) {
  const { t } = useTranslation('compare')
  const [companies, setCompanies] = useState<Company[]>([])
  const [cnpjInput, setCnpjInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Load saved companies on component mount
  useEffect(() => {
    const savedCompanies = getComparisonCompanies()
    if (savedCompanies.length > 0) {
      // Convert ComparisonCompany to Company format
      const convertedCompanies: Company[] = savedCompanies.map(saved => ({
        cnpj: saved.cnpj,
        razaoSocial: saved.razaoSocial,
        nomeFantasia: saved.nomeFantasia,
        situacao: saved.situacao,
        dataAbertura: saved.dataAbertura,
        capitalSocial: saved.capitalSocial.toString(),
        porte: saved.porte,
        naturezaJuridica: saved.naturezaJuridica,
        cnaePrincipal: saved.atividadePrincipal,
        cnaesSecundarios: [],
        logradouro: saved.endereco.logradouro,
        numero: saved.endereco.numero,
        complemento: saved.endereco.complemento,
        bairro: saved.endereco.bairro,
        municipio: saved.endereco.municipio,
        uf: saved.endereco.uf,
        cep: saved.endereco.cep,
        telefones: saved.telefone ? [{ ddd: '', numero: saved.telefone }] : undefined,
        email: saved.email,
        // Add default values for missing properties
        qsa: [],
        situacaoEspecial: undefined,
        dataSituacaoEspecial: undefined,
      }))
      setCompanies(convertedCompanies)
    }
  }, [])

  const handleAddCompany = async () => {
    const cleanCnpj = cnpjClean(cnpjInput)

    if (!isValidCnpj(cleanCnpj)) {
      toast({
        title: t('invalidCnpj', 'CNPJ inválido'),
        description: t('invalidCnpjDesc', 'Por favor, digite um CNPJ válido.'),
        variant: 'destructive',
      })
      return
    }

    if (companies.some(company => company.cnpj === cleanCnpj)) {
      toast({
        title: t('companyAlreadyAdded', 'Empresa já adicionada'),
        description: t('companyAlreadyAddedDesc', 'Esta empresa já está na comparação.'),
        variant: 'destructive',
      })
      return
    }

    if (companies.length >= 4) {
      toast({
        title: t('limitReached', 'Limite atingido'),
        description: t('limitReachedDesc', 'Você pode comparar no máximo 4 empresas.'),
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      // Use internal API route to avoid CORS issues
      const response = await fetch(`/api/company/${cleanCnpj}`)

      if (!response.ok) {
        throw new Error('Empresa não encontrada')
      }

      const company = await response.json()
      setCompanies(prev => [...prev, company])
      setCnpjInput('')

      // Save to localStorage
      addComparisonCompany({
        cnpj: company.cnpj,
        razaoSocial: company.razaoSocial,
        nomeFantasia: company.nomeFantasia,
        situacao: company.situacao,
        dataAbertura: company.dataAbertura,
        capitalSocial: parseFloat(company.capitalSocial) || 0,
        porte: company.porte || 'Não informado',
        naturezaJuridica: company.naturezaJuridica || { codigo: '', descricao: 'Não informado' },
        atividadePrincipal: company.cnaePrincipal || { codigo: '', descricao: 'Não informado' },
        endereco: {
          logradouro: company.logradouro || '',
          numero: company.numero || '',
          complemento: company.complemento,
          bairro: company.bairro || '',
          municipio: company.municipio || '',
          uf: company.uf || '',
          cep: company.cep || '',
        },
        telefone: company.telefones?.[0]?.numero,
        email: company.email,
      })

      toast({
        title: t('companyAdded', 'Empresa adicionada'),
        description: t('companyAddedDesc', { companyName: company.razaoSocial }),
      })
    } catch (error) {
      toast({
        title: t('errorFetchingCompany', 'Erro ao buscar empresa'),
        description: t('errorFetchingCompanyDesc', 'Não foi possível encontrar a empresa com este CNPJ.'),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveCompany = (cnpj: string) => {
    setCompanies(prev => prev.filter(company => company.cnpj !== cnpj))
    // Remove from localStorage
    removeComparisonCompany(cnpj)
  }

  const handleCnpjChange = (value: string) => {
    setCnpjInput(cnpjMask(value))
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-brand-600 via-purple-600 to-accent-500 bg-clip-text text-transparent">
            {t('title', 'Comparar Empresas')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle', 'Compare informações de até 4 empresas lado a lado com dados detalhados e análises visuais')}
          </p>
        </div>

        {/* Add Company Form */}
        <Card className="bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-xl">
              <div className="p-2 rounded-full bg-gradient-to-br from-brand-500 to-accent-500">
                <Plus className="h-5 w-5 text-white" />
              </div>
              {t('addCompany', 'Adicionar Empresa')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-accent-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative">
                  <Input
                    placeholder={t('cnpjPlaceholder', 'Digite o CNPJ da empresa...')}
                    value={cnpjInput}
                    onChange={(e) => handleCnpjChange(e.target.value)}
                    maxLength={18}
                    className="h-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-brand-200 dark:border-brand-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg transition-all duration-300"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddCompany}
                disabled={isLoading || !cnpjInput}
                className="h-12 px-8 bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-700 hover:to-accent-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t('searching', 'Buscando...')}
                  </div>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    {t('add', 'Adicionar')}
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-center font-medium text-gray-700 dark:text-gray-300 mt-4 p-3 bg-gradient-to-r from-brand-100 to-accent-100 dark:from-brand-900/70 dark:to-accent-900/70 border border-brand-300 dark:border-brand-700 rounded-lg">
              {t('companiesAdded', { count: companies.length })}
            </p>
          </CardContent>
        </Card>

        {/* Companies Comparison */}
        {companies.length === 0 ? (
          <Card className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center mb-6">
                <TrendingUp className="h-10 w-10 text-brand-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                {t('noCompaniesAdded', 'Nenhuma empresa adicionada')}
              </h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {t('noCompaniesDesc', 'Adicione empresas usando o formulário acima para começar a comparação.')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {companies.map((company) => (
              <Card key={company.cnpj} className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3 h-8 w-8 p-0 z-10 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-950/70 text-red-600 dark:text-red-400 rounded-full transition-all duration-300 hover:scale-110"
                  onClick={() => handleRemoveCompany(company.cnpj)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <CardHeader className="pb-4 relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <Badge className={`${getStatusColor(company.situacao || '')} px-3 py-1 font-semibold`}>
                        {company.situacao || 'N/A'}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                      {company.razaoSocial}
                    </h3>
                    {company.nomeFantasia && (
                      <p className="text-sm text-muted-foreground font-medium">
                        {company.nomeFantasia}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      CNPJ
                    </label>
                    <p className="font-mono text-sm">{formatCNPJ(company.cnpj)}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t('labels.mainActivity', 'Atividade Principal')}
                    </label>
                    <p className="text-sm">
                      {company.cnaePrincipal || t('notInformed', 'Não informado')}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t('labels.location', 'Localização')}
                    </label>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {company.endereco?.municipio}, {company.endereco?.uf}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t('labels.openingDate', 'Data de Abertura')}
                    </label>
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(company.abertura)}
                    </p>
                  </div>

                  {company.capitalSocial && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {t('labels.socialCapital', 'Capital Social')}
                      </label>
                      <p className="text-sm flex items-center gap-1 font-medium">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(company.capitalSocial)}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t('labels.legalNature', 'Natureza Jurídica')}
                    </label>
                    <p className="text-sm">
                      {company.naturezaJuridica || t('notInformed', 'Não informado')}
                    </p>
                  </div>

                  {company.porte && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {t('labels.size', 'Porte')}
                      </label>
                      <p className="text-sm">{company.porte}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Comparison Summary */}
        {companies.length > 1 && (
          <Card className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                {t('comparisonSummary', 'Resumo da Comparação')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-3">
                    {companies.filter(c => c.situacao?.toLowerCase() === 'ativa').length}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground">{t('summary.activeCompanies', 'Empresas Ativas')}</div>
                </div>

                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950/50 dark:to-brand-900/50 border-2 border-brand-200 dark:border-brand-800 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-3">
                    {new Set(companies.map(c => c.endereco?.uf).filter(Boolean)).size}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground">{t('summary.differentStates', 'Estados Diferentes')}</div>
                </div>

                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                    {new Set(companies.map(c => c.cnaePrincipal)).size}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground">{t('summary.differentCnaes', 'CNAEs Diferentes')}</div>
                </div>

                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                    {companies.filter(c => c.capitalSocial && parseFloat(c.capitalSocial) > 0).length}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground">{t('summary.withCapital', 'Com Capital Informado')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}