'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Globe
} from 'lucide-react'
import { Company } from '@/lib/api'
import { formatCurrency, formatDate, formatCNPJ, formatPhone } from '@/lib/utils'

interface CompanyBasicInfoProps {
  company: Company
}

export function CompanyBasicInfo({ company }: CompanyBasicInfoProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativa':
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'suspensa':
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'baixada':
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getCompanySize = (capital: number) => {
    if (capital >= 4800000) return 'Grande Porte'
    if (capital >= 360000) return 'Médio Porte'
    if (capital >= 81000) return 'Pequeno Porte'
    return 'Microempresa'
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Razão Social
            </label>
            <p className="font-medium">{company.razaoSocial}</p>
          </div>

          {company.nomeFantasia && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nome Fantasia
              </label>
              <p className="font-medium">{company.nomeFantasia}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              CNPJ
            </label>
            <p className="font-mono">{formatCNPJ(company.cnpj)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            <div className="mt-1">
              <Badge className={getStatusColor(company.situacao || '')}>
                {company.situacao || 'N/A'}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Porte da Empresa
            </label>
            <p>{company.porte || getCompanySize(parseFloat(company.capitalSocial || '0'))}</p>
          </div>
        </CardContent>
      </Card>

      {/* Atividade Econômica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Atividade Econômica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              CNAE Principal
            </label>
            <p className="font-medium">
              {company.cnaePrincipal}
            </p>
          </div>

          {company.cnaesSecundarios && company.cnaesSecundarios.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                CNAEs Secundárias ({company.cnaesSecundarios.length})
              </label>
              <div className="mt-2 space-y-1">
                {company.cnaesSecundarios.slice(0, 5).map((cnae, index) => (
                  <p key={index} className="text-sm">
                    {cnae}
                  </p>
                ))}
                {company.cnaesSecundarios.length > 5 && (
                  <p className="text-sm text-muted-foreground">
                    +{company.cnaesSecundarios.length - 5} outras atividades
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Natureza Jurídica
            </label>
            <p>{company.naturezaJuridica}</p>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Logradouro
            </label>
            <p>
              {company.endereco?.logradouro}
              {company.endereco?.numero && `, ${company.endereco.numero}`}
              {company.endereco?.complemento && ` - ${company.endereco.complemento}`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Bairro
              </label>
              <p>{company.endereco?.bairro}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                CEP
              </label>
              <p className="font-mono">{company.endereco?.cep}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Município
              </label>
              <p>{company.endereco?.municipio}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                UF
              </label>
              <p>{company.endereco?.uf}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contato e Datas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contato e Datas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {company.telefones && company.telefones.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Telefone
              </label>
              <p className="font-mono">{company.telefones[0].ddd} {company.telefones[0].numero}</p>
            </div>
          )}

          {company.email && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                E-mail
              </label>
              <p>{company.email}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Data de Abertura
            </label>
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(company.abertura || '')}
            </p>
          </div>

          {company.dataSituacao && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Data da Situação
              </label>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(company.dataSituacao)}
              </p>
            </div>
          )}

          {company.capitalSocial && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Capital Social
              </label>
              <p className="flex items-center gap-2 font-medium">
                <DollarSign className="h-4 w-4" />
                {formatCurrency(company.capitalSocial)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}