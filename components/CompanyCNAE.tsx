"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Target,
  List,
  Search,
  ChevronDown,
  ChevronUp,
  Briefcase
} from 'lucide-react';
import { CNAEItem, NaturezaJuridica } from '@/lib/api';

interface CompanyCNAEProps {
  company: {
    cnaePrincipal?: CNAEItem;
    cnaesSecundarios?: CNAEItem[];
    naturezaJuridica?: NaturezaJuridica;
    porte?: string;
  };
}

export function CompanyCNAE({ company }: CompanyCNAEProps) {
  const { cnaePrincipal, cnaesSecundarios, naturezaJuridica, porte } = company;
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Filtrar CNAEs secundários com base na busca
  const filteredCnaes = cnaesSecundarios?.filter(cnae => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      cnae.codigo.toLowerCase().includes(term) ||
      cnae.descricao.toLowerCase().includes(term)
    );
  }) || [];

  // Mostrar apenas os primeiros 5 ou todos
  const displayedCnaes = showAll ? filteredCnaes : filteredCnaes.slice(0, 5);
  const hasMoreCnaes = filteredCnaes.length > 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Atividades Econômicas (CNAE)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* CNAE Principal */}
        {cnaePrincipal && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-sm">Atividade Principal</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Principal
              </Badge>
            </div>
            <div className="ml-6 space-y-2">
              <p className="text-sm font-mono text-muted-foreground">
                {cnaePrincipal.codigo}
              </p>
              <p className="text-sm font-medium">
                {cnaePrincipal.descricao}
              </p>
            </div>
          </div>
        )}

        {/* CNAEs Secundários */}
        {cnaesSecundarios && cnaesSecundarios.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-sm">Atividades Secundárias</span>
                <Badge variant="secondary">
                  {cnaesSecundarios.length}
                </Badge>
              </div>

              {/* Campo de busca */}
              {cnaesSecundarios.length > 3 && (
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9 text-sm"
                  />
                </div>
              )}
            </div>

            {/* Lista de CNAEs */}
            <div className="ml-6 space-y-3">
              {displayedCnaes.length > 0 ? (
                <>
                  {displayedCnaes.map((cnae, index) => (
                    <div key={index} className="space-y-1">
                      <p className="text-sm font-mono text-muted-foreground">
                        {cnae.codigo}
                      </p>
                      <p className="text-sm">
                        {cnae.descricao}
                      </p>
                    </div>
                  ))}

                  {/* Botão Ver Mais/Menos */}
                  {hasMoreCnaes && !searchTerm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAll(!showAll)}
                      className="w-full mt-2"
                    >
                      {showAll ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Mostrar menos
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Ver todas as {filteredCnaes.length} atividades
                        </>
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    Nenhuma atividade encontrada para &quot;{searchTerm}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informações Adicionais */}
        <div className="pt-4 border-t space-y-4">
          {/* Natureza Jurídica */}
          {naturezaJuridica && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Natureza Jurídica
              </label>
              <p className="text-sm mt-1">
                {naturezaJuridica.codigo && `${naturezaJuridica.codigo} - `}
                {naturezaJuridica.descricao}
              </p>
            </div>
          )}

          {/* Porte */}
          {porte && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Porte da Empresa
              </label>
              <div className="mt-1">
                <Badge variant="outline" className="font-medium">
                  {porte}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}