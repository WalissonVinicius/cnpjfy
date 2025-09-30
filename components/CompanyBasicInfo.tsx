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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Informações Básicas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Coluna 1 */}
          <div className="space-y-4">
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
          </div>

          {/* Coluna 2 */}
          <div className="space-y-4">
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

            {company.matrizOuFilial && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tipo
                </label>
                <p>{company.matrizOuFilial}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Porte da Empresa
              </label>
              <p>{company.porte || getCompanySize(parseFloat(company.capitalSocial || '0'))}</p>
            </div>

            {company.abertura && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Data de Abertura
                </label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(company.abertura)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Capital Social - Destaque em separado */}
        {company.capitalSocial && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                Capital Social
              </label>
              <p className="flex items-center gap-2 font-bold text-lg">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                {formatCurrency(company.capitalSocial)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}