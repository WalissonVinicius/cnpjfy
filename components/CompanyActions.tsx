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
import { exportCompanyToCsv } from '@/lib/exports/csv';
import { Company } from '@/lib/api';

interface CompanyActionsProps {
  company: Company;
  locale?: string;
}

export function CompanyActions({ company }: CompanyActionsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsLoading('pdf');
    try {
      // Importação dinâmica do html2pdf para evitar problemas de SSR
      const html2pdf = (await import('html2pdf.js')).default;

      // Capturar o conteúdo da empresa
      const companyContent = document.querySelector('.company-content');
      if (!companyContent) {
        toast({
          title: "Erro na Exportação",
          description: "Conteúdo da empresa não encontrado.",
          variant: "destructive",
        });
        return;
      }

      // Criar HTML estruturado para o PDF
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${company.razaoSocial || company.nomeFantasia || 'Empresa'} - CNPJfy</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              background-color: #ffffff !important;
              color: #1f2937 !important;
              line-height: 1.6;
              padding: 20px;
            }
            
            .pdf-header {
              text-align: center;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .pdf-title {
              font-size: 24px;
              font-weight: bold;
              color: #1f2937 !important;
              margin-bottom: 8px;
            }
            
            .pdf-subtitle {
              font-size: 16px;
              color: #6b7280 !important;
              font-weight: 500;
            }
            
            .info-section {
              margin-bottom: 25px;
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937 !important;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 15px;
            }
            
            .info-item {
              margin-bottom: 12px;
            }
            
            .info-label {
              font-size: 12px;
              font-weight: 600;
              color: #6b7280 !important;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            
            .info-value {
              font-size: 14px;
              color: #1f2937 !important;
              font-weight: 500;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            
            .status-ativa {
              background-color: #dcfce7;
              color: #166534;
            }
            
            .status-inativa {
              background-color: #fee2e2;
              color: #991b1b;
            }
            
            .partners-list {
              margin-top: 10px;
            }
            
            .partner-item {
              padding: 8px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .partner-name {
              font-weight: 600;
              color: #1f2937 !important;
            }
            
            .partner-details {
              font-size: 12px;
              color: #6b7280 !important;
              margin-top: 2px;
            }
            
            .pdf-footer {
               margin-top: 40px;
               text-align: center;
               color: #6b7280 !important;
               font-size: 12px;
               border-top: 1px solid #e5e7eb;
               padding-top: 20px;
             }
             
             .brand {
               margin-top: 8px;
               color: #3b82f6 !important;
               font-weight: 600;
             }
             
             .page-break {
               page-break-before: always;
               break-before: page;
             }
             
             .partners-section {
               page-break-inside: avoid;
             }
             
             .partner-group {
               margin-bottom: 20px;
               page-break-inside: avoid;
             }
          </style>
        </head>
        <body>
          <div class="pdf-header">
            <h1 class="pdf-title">${company.razaoSocial || company.nomeFantasia || 'N/A'}</h1>
            <p class="pdf-subtitle">CNPJ: ${company.cnpj || 'N/A'}</p>
          </div>
          
          <div class="info-section">
            <h2 class="section-title">📋 Informações Básicas</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Razão Social</div>
                <div class="info-value">${company.razaoSocial || 'N/A'}</div>
              </div>
              ${company.nomeFantasia ? `
                <div class="info-item">
                  <div class="info-label">Nome Fantasia</div>
                  <div class="info-value">${company.nomeFantasia}</div>
                </div>
              ` : ''}
              <div class="info-item">
                <div class="info-label">CNPJ</div>
                <div class="info-value">${company.cnpj || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Status</div>
                <div class="info-value">
                  <span class="status-badge ${company.situacao?.toLowerCase().includes('ativa') ? 'status-ativa' : 'status-inativa'}">
                    ${company.situacao || 'N/A'}
                  </span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Natureza Jurídica</div>
                <div class="info-value">${company.naturezaJuridica || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Porte</div>
                <div class="info-value">${company.porte || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Data de Abertura</div>
                <div class="info-value">${company.abertura ? new Date(company.abertura).toLocaleDateString('pt-BR') : 'N/A'}</div>
              </div>
              ${company.capitalSocial ? `
                <div class="info-item">
                  <div class="info-label">Capital Social</div>
                  <div class="info-value">R$ ${parseFloat(company.capitalSocial).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
              ` : ''}
            </div>
          </div>
          
          ${company.endereco ? `
            <div class="info-section">
              <h2 class="section-title">📍 Endereço</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Logradouro</div>
                  <div class="info-value">${company.endereco.logradouro || 'N/A'}${company.endereco.numero ? `, ${company.endereco.numero}` : ''}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Bairro</div>
                  <div class="info-value">${company.endereco.bairro || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Município</div>
                  <div class="info-value">${company.endereco.municipio || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">UF</div>
                  <div class="info-value">${company.endereco.uf || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">CEP</div>
                  <div class="info-value">${company.endereco.cep || 'N/A'}</div>
                </div>
              </div>
            </div>
          ` : ''}
          
          ${company.cnaePrincipal ? `
            <div class="info-section">
              <h2 class="section-title">🏢 Atividades</h2>
              <div class="info-item">
                <div class="info-label">Atividade Principal</div>
                <div class="info-value">${company.cnaePrincipal}</div>
              </div>
              ${company.cnaesSecundarios && company.cnaesSecundarios.length > 0 ? `
                <div class="info-item">
                  <div class="info-label">Atividades Secundárias</div>
                  <div class="info-value">${company.cnaesSecundarios.slice(0, 5).join('; ')}${company.cnaesSecundarios.length > 5 ? ` (+${company.cnaesSecundarios.length - 5} outras)` : ''}</div>
                </div>
              ` : ''}
            </div>
          ` : ''}
          
          ${company.socios && company.socios.length > 0 ? `
            <div class="info-section partners-section">
              <h2 class="section-title">👥 Sócios e Administradores</h2>
              <div class="partners-list">
                ${company.socios.map((socio, index) => {
        const pageBreak = index > 0 && index % 8 === 0 ? '<div class="page-break"></div>' : '';
        return `
                    ${pageBreak}
                    <div class="partner-item">
                      <div class="partner-name">${socio.nome || 'N/A'}</div>
                      <div class="partner-details">
                        ${socio.qualificacao || 'N/A'}
                      </div>
                    </div>
                  `;
      }).join('')}
              </div>
            </div>
          ` : ''}
          
          <div class="pdf-footer">
            <p>Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
            <p class="brand">CNPJfy - Consulta de Empresas</p>
          </div>
        </body>
        </html>
      `;

      // Criar elemento temporário com o HTML
      const tempElement = document.createElement('div');
      tempElement.innerHTML = pdfContent;

      // Configurações otimizadas do PDF
      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `empresa-${company.cnpj?.replace(/\D/g, '') || 'dados'}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: {
          type: 'jpeg',
          quality: 0.98
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          width: 800,
          height: 1200
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy']
        }
      };

      // Gerar e fazer download do PDF
      await html2pdf().set({
        ...opt,
        jsPDF: {
          ...opt.jsPDF,
          orientation: 'portrait' as const // Explicitly type as 'portrait' literal
        },
        image: {
          ...opt.image,
          type: 'jpeg' as const
        }
      }).from(tempElement).save();

      toast({
        title: "PDF Gerado",
        description: "O PDF foi gerado e baixado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro na Exportação",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleExportCSV = async () => {
    setIsLoading('csv');
    try {
      // Usar a função de exportação CSV existente
      exportCompanyToCsv(company, {
        filename: `empresa-${company.cnpj?.replace(/\D/g, '') || 'dados'}-${new Date().toISOString().split('T')[0]}.csv`,
        locale: 'pt-BR'
      });

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
    const title = `${company.razaoSocial || company.nomeFantasia || 'Empresa'} - CNPJfy`;

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
    // Criar conteúdo específico para impressão
    const printContent = document.querySelector('.company-content');
    if (!printContent) {
      toast({
        title: "Erro na Impressão",
        description: "Conteúdo da empresa não encontrado.",
        variant: "destructive",
      });
      return;
    }

    // Criar janela de impressão com conteúdo específico
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Erro na Impressão",
        description: "Não foi possível abrir janela de impressão.",
        variant: "destructive",
      });
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${company.razaoSocial || company.nomeFantasia || 'Empresa'} - CNPJfy</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333; 
            line-height: 1.6;
          }
          .header { 
            border-bottom: 2px solid #e5e7eb; 
            padding-bottom: 20px; 
            margin-bottom: 20px; 
          }
          .company-name { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 10px; 
          }
          .cnpj { 
            font-size: 16px; 
            color: #6b7280; 
          }
          .section { 
            margin-bottom: 30px; 
            page-break-inside: avoid;
          }
          .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 15px; 
            color: #374151; 
            border-bottom: 1px solid #e5e7eb; 
            padding-bottom: 5px; 
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 15px; 
          }
          .info-item { 
            margin-bottom: 10px; 
          }
          .info-label { 
            font-weight: bold; 
            color: #6b7280; 
            font-size: 12px; 
            text-transform: uppercase; 
          }
          .info-value { 
            margin-top: 2px; 
          }
          .badge { 
            display: inline-block; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 12px; 
            font-weight: bold; 
          }
          .badge-active { 
            background-color: #dcfce7; 
            color: #166534; 
          }
          .footer {
            margin-top: 40px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
          }
          @page {
            margin: 2cm;
            size: A4;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">${company.razaoSocial || 'N/A'}</div>
          <div class="cnpj">CNPJ: ${company.cnpj || 'N/A'}</div>
        </div>
        ${printContent.innerHTML}
        <div class="footer">
          Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} - CNPJfy
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Aguardar carregamento e imprimir
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
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