"use client";

import { Building2, MapPin, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCnpj } from '@/lib/cnpj';
import { formatDate } from '@/lib/utils';
import type { Company } from '@/lib/api';

interface CompanyHeaderProps {
  company: Company;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  const getStatusColor = (status?: string) => {
    if (!status) return 'secondary';

    const statusLower = status.toLowerCase();
    if (statusLower.includes('ativa')) return 'default';
    if (statusLower.includes('suspensa')) return 'destructive';
    if (statusLower.includes('baixada')) return 'secondary';
    return 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl lg:text-3xl flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              {company.razaoSocial}
            </CardTitle>

            {company.nomeFantasia && (
              <p className="text-lg text-muted-foreground">
                {company.nomeFantasia}
              </p>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="outline" className="font-mono">
                CNPJ: {formatCnpj(company.cnpj)}
              </Badge>

              {company.situacao && (
                <Badge variant={getStatusColor(company.situacao)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {company.situacao}
                </Badge>
              )}

              {company.matrizOuFilial && (
                <Badge variant="secondary">
                  {company.matrizOuFilial}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {company.abertura && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Abertura:</span>
              <span className="font-medium">{formatDate(company.abertura)}</span>
            </div>
          )}

          {company.endereco?.municipio && company.endereco?.uf && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Localização:</span>
              <span className="font-medium">
                {company.endereco.municipio}/{company.endereco.uf}
              </span>
            </div>
          )}

          {company.porte && (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Porte:</span>
              <span className="font-medium">{company.porte}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}