'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  User,
  Building2,
  Crown,
  Percent,
  Calendar,
  FileText
} from 'lucide-react'
import { Company } from '@/lib/api'
import { formatCurrency, formatDate, formatCPF, formatCNPJ } from '@/lib/utils'

interface CompanyPartnersProps {
  company: Company
}

interface Partner {
  nome: string
  cpfCnpj: string
  qualificacao: string
  dataEntrada?: string
  percentualCapital?: number
  representanteLegal?: string
  pais?: string
}

export function CompanyPartners({ company }: CompanyPartnersProps) {
  // Mock data - in real implementation, this would come from the API
  const partners: Partner[] = (company.socios || []).map(socio => ({
    nome: socio.nome,
    cpfCnpj: socio.doc || '',
    qualificacao: socio.qualificacao || '',
    dataEntrada: socio.entrada,
    representanteLegal: socio.tipo
  }))

  const getPartnerType = (cpfCnpj: string) => {
    if (!cpfCnpj || typeof cpfCnpj !== 'string') {
      return 'Não informado'
    }
    return cpfCnpj.length === 11 ? 'Pessoa Física' : 'Pessoa Jurídica'
  }

  const getQualificationColor = (qualification: string) => {
    const qual = qualification?.toLowerCase()
    if (qual?.includes('administrador') || qual?.includes('diretor')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    }
    if (qual?.includes('sócio') || qual?.includes('quotista')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    }
    if (qual?.includes('presidente') || qual?.includes('ceo')) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  const formatDocument = (cpfCnpj: string) => {
    if (!cpfCnpj || typeof cpfCnpj !== 'string') {
      return 'Não informado'
    }
    return cpfCnpj.length === 11 ? formatCPF(cpfCnpj) : formatCNPJ(cpfCnpj)
  }

  if (!partners || partners.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Sócios e Administradores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma informação de sócios disponível</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-base sm:text-lg md:text-xl">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Sócios e Administradores</span>
          </div>
          <Badge variant="secondary" className="sm:ml-auto text-xs sm:text-sm w-fit">
            {partners.length} {partners.length === 1 ? 'sócio' : 'sócios'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 flex-shrink-0">
                    {getPartnerType(partner.cpfCnpj) === 'Pessoa Física' ? (
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    ) : (
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm sm:text-base md:text-lg break-words">{partner.nome}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">
                      {getPartnerType(partner.cpfCnpj)} • {formatDocument(partner.cpfCnpj)}
                    </p>
                  </div>
                </div>

                {partner.percentualCapital && (
                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-medium">
                      <Percent className="h-3 w-3" />
                      {partner.percentualCapital}%
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">do capital</p>
                  </div>
                )}
              </div>

              <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Qualificação
                  </label>
                  <div className="mt-1">
                    <Badge className={getQualificationColor(partner.qualificacao)}>
                      {partner.qualificacao}
                    </Badge>
                  </div>
                </div>

                {partner.dataEntrada && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Data de Entrada
                    </label>
                    <p className="flex items-center gap-1 text-sm mt-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(partner.dataEntrada)}
                    </p>
                  </div>
                )}

                {partner.representanteLegal && (
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Representante Legal
                    </label>
                    <p className="flex items-center gap-1 text-sm mt-1">
                      <Crown className="h-3 w-3" />
                      {partner.representanteLegal}
                    </p>
                  </div>
                )}

                {partner.pais && partner.pais !== 'BRASIL' && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      País
                    </label>
                    <p className="text-sm mt-1">{partner.pais}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Resumo do Capital Social */}
        {company.capitalSocial && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Capital Social Total</span>
              </div>
              <span className="font-semibold">
                {formatCurrency(company.capitalSocial)}
              </span>
            </div>

            {partners.some(p => p.percentualCapital) && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Distribuição do Capital</span>
                  <span>
                    {partners.reduce((acc, p) => acc + (p.percentualCapital || 0), 0)}% mapeado
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, partners.reduce((acc, p) => acc + (p.percentualCapital || 0), 0))}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}