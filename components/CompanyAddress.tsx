"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Globe } from 'lucide-react';

interface CompanyAddressProps {
  company: {
    endereco?: {
      logradouro?: string;
      numero?: string;
      complemento?: string;
      bairro?: string;
      municipio?: string;
      uf?: string;
      cep?: string;
    };
    situacao_cadastral?: string;
    data_situacao_cadastral?: string;
  };
}

export function CompanyAddress({ company }: CompanyAddressProps) {
  const { endereco } = company;

  if (!endereco) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Informações de endereço não disponíveis</p>
        </CardContent>
      </Card>
    );
  }

  const formatAddress = () => {
    const parts = [];

    if (endereco.logradouro) parts.push(endereco.logradouro);
    if (endereco.numero) parts.push(endereco.numero);
    if (endereco.complemento) parts.push(endereco.complemento);

    return parts.join(', ');
  };

  const formatLocation = () => {
    const parts = [];

    if (endereco.bairro) parts.push(endereco.bairro);
    if (endereco.municipio) parts.push(endereco.municipio);
    if (endereco.uf) parts.push(endereco.uf);

    return parts.join(' - ');
  };

  const formatCEP = (cep?: string) => {
    if (!cep) return '-';
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return cep;
    return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const getSituacaoColor = (situacao?: string) => {
    if (!situacao) return 'secondary';

    const situacaoLower = situacao.toLowerCase();
    if (situacaoLower.includes('ativa')) return 'default';
    if (situacaoLower.includes('suspensa')) return 'destructive';
    if (situacaoLower.includes('baixada')) return 'secondary';
    return 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Endereço
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="font-medium">{formatAddress() || 'Não informado'}</p>
              <p className="text-sm text-muted-foreground">{formatLocation()}</p>
              <p className="text-sm text-muted-foreground">
                CEP: {formatCEP(endereco.cep)}
              </p>
            </div>
          </div>
        </div>

        {company.situacao_cadastral && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Situação Cadastral:</span>
              <Badge variant={getSituacaoColor(company.situacao_cadastral)}>
                {company.situacao_cadastral}
              </Badge>
            </div>
            {company.data_situacao_cadastral && (
              <p className="text-xs text-muted-foreground mt-1 ml-6">
                Desde: {new Date(company.data_situacao_cadastral).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}