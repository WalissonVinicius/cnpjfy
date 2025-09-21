"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Target, List } from 'lucide-react';

interface CNAEItem {
  codigo?: string;
  descricao?: string;
  principal?: boolean;
}

interface CompanyCNAEProps {
  company: {
    cnae_principal?: CNAEItem;
    cnaes_secundarios?: CNAEItem[];
    natureza_juridica?: {
      codigo?: string;
      descricao?: string;
    };
    porte?: string;
  };
}

export function CompanyCNAE({ company }: CompanyCNAEProps) {
  const { cnae_principal, cnaes_secundarios, natureza_juridica, porte } = company;

  const formatCNAE = (cnae: CNAEItem) => {
    if (!cnae.codigo && !cnae.descricao) return 'Não informado';

    const parts = [];
    if (cnae.codigo) parts.push(cnae.codigo);
    if (cnae.descricao) parts.push(cnae.descricao);

    return parts.join(' - ');
  };

  const getPorteColor = (porte?: string) => {
    if (!porte) return 'secondary';

    const porteLower = porte.toLowerCase();
    if (porteLower.includes('micro')) return 'default';
    if (porteLower.includes('pequeno')) return 'secondary';
    if (porteLower.includes('médio') || porteLower.includes('medio')) return 'outline';
    if (porteLower.includes('grande')) return 'destructive';
    return 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Atividades Econômicas (CNAE)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CNAE Principal */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="font-medium text-sm">Atividade Principal</span>
            <Badge variant="default" className="text-xs">Principal</Badge>
          </div>
          <p className="text-sm text-muted-foreground ml-6">
            {cnae_principal ? formatCNAE(cnae_principal) : 'Não informado'}
          </p>
        </div>

        {/* CNAEs Secundários */}
        {cnaes_secundarios && cnaes_secundarios.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <List className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm">Atividades Secundárias</span>
              <Badge variant="secondary" className="text-xs">
                {cnaes_secundarios.length} atividade{cnaes_secundarios.length > 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="space-y-2 ml-6">
              {cnaes_secundarios.slice(0, 5).map((cnae, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  • {formatCNAE(cnae)}
                </p>
              ))}
              {cnaes_secundarios.length > 5 && (
                <p className="text-xs text-muted-foreground italic">
                  ... e mais {cnaes_secundarios.length - 5} atividade{cnaes_secundarios.length - 5 > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Informações Adicionais */}
        <div className="pt-3 border-t space-y-3">
          {natureza_juridica && (
            <div>
              <span className="text-sm font-medium">Natureza Jurídica:</span>
              <p className="text-sm text-muted-foreground">
                {natureza_juridica.codigo && natureza_juridica.descricao
                  ? `${natureza_juridica.codigo} - ${natureza_juridica.descricao}`
                  : natureza_juridica.descricao || natureza_juridica.codigo || 'Não informado'
                }
              </p>
            </div>
          )}

          {porte && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Porte da Empresa:</span>
              <Badge variant={getPorteColor(porte)}>
                {porte}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}