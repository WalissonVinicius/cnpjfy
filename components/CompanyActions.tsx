"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Download,
  Share2,
  FileText,
  Printer,
  Heart,
  Copy,
  ExternalLink,
  Star
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface CompanyActionsProps {
  company: {
    cnpj?: string;
    razao_social?: string;
    nome_fantasia?: string;
  };
  locale?: string;
}

export function CompanyActions({ company }: CompanyActionsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsLoading('pdf');
    try {
      // Simular exportação PDF
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "PDF Exportado",
        description: "Os dados da empresa foram exportados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na Exportação",
        description: "Não foi possível exportar o PDF. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleExportCSV = async () => {
    setIsLoading('csv');
    try {
      // Simular exportação CSV
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "CSV Exportado",
        description: "Os dados da empresa foram exportados em formato CSV.",
      });
    } catch (error) {
      toast({
        title: "Erro na Exportação",
        description: "Não foi possível exportar o CSV. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = `${company.razao_social || company.nome_fantasia || 'Empresa'} - CNPJfy`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Confira os dados desta empresa no CNPJfy`,
          url,
        });
      } catch (error) {
        // Fallback para cópia do link
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      toast({
        title: "Link Copiado",
        description: "O link da empresa foi copiado para a área de transferência.",
      });
    } else {
      toast({
        title: "Erro ao Copiar",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removido dos Favoritos" : "Adicionado aos Favoritos",
      description: isFavorited
        ? "A empresa foi removida da sua lista de favoritos."
        : "A empresa foi adicionada à sua lista de favoritos.",
    });
  };

  const handleOpenReceita = () => {
    if (company.cnpj) {
      const cleanCNPJ = company.cnpj.replace(/\D/g, '');
      window.open(`https://servicos.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp?cnpj=${cleanCNPJ}`, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Ações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Exportar PDF */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={isLoading === 'pdf'}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <FileText className="h-4 w-4" />
            <span className="text-xs">
              {isLoading === 'pdf' ? 'Exportando...' : 'PDF'}
            </span>
          </Button>

          {/* Exportar CSV */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={isLoading === 'csv'}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Download className="h-4 w-4" />
            <span className="text-xs">
              {isLoading === 'csv' ? 'Exportando...' : 'CSV'}
            </span>
          </Button>

          {/* Compartilhar */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs">Compartilhar</span>
          </Button>

          {/* Imprimir */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Printer className="h-4 w-4" />
            <span className="text-xs">Imprimir</span>
          </Button>

          {/* Favoritar */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFavorite}
            className="flex flex-col gap-1 h-auto py-3"
          >
            {isFavorited ? (
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            ) : (
              <Heart className="h-4 w-4" />
            )}
            <span className="text-xs">
              {isFavorited ? 'Favoritado' : 'Favoritar'}
            </span>
          </Button>

          {/* Copiar Link */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Copy className="h-4 w-4" />
            <span className="text-xs">Copiar Link</span>
          </Button>

          {/* Receita Federal */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenReceita}
            disabled={!company.cnpj}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-xs">Receita</span>
          </Button>

          {/* Avaliar */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({
              title: "Em Breve",
              description: "Funcionalidade de avaliação será implementada em breve.",
            })}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Star className="h-4 w-4" />
            <span className="text-xs">Avaliar</span>
          </Button>
        </div>

        <div className="mt-4 pt-3 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Use essas ações para exportar, compartilhar ou salvar os dados da empresa
          </p>
        </div>
      </CardContent>
    </Card>
  );
}