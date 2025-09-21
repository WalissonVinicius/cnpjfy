import type { Company } from '../api';

export interface ExportOptions {
  filename?: string;
  pretty?: boolean;
  includeMetadata?: boolean;
}

export function exportToJson(
  data: Company | Company[],
  options: ExportOptions = {}
): void {
  const {
    filename = `opencnpj-export-${new Date().toISOString().split('T')[0]}.json`,
    pretty = true,
    includeMetadata = true,
  } = options;

  const exportData = {
    ...(includeMetadata && {
      metadata: {
        exportedAt: new Date().toISOString(),
        source: 'CNPJfy',
        version: '1.0.0',
        count: Array.isArray(data) ? data.length : 1,
      },
    }),
    data: Array.isArray(data) ? data : [data],
  };

  const jsonString = pretty 
    ? JSON.stringify(exportData, null, 2)
    : JSON.stringify(exportData);

  downloadFile(jsonString, filename, 'application/json');
}

export function exportCompanyToJson(company: Company, options?: ExportOptions): void {
  const filename = options?.filename || `empresa-${company.cnpj}-${new Date().toISOString().split('T')[0]}.json`;
  exportToJson(company, { ...options, filename });
}

export function exportComparisonToJson(companies: Company[], options?: ExportOptions): void {
  const filename = options?.filename || `comparacao-empresas-${new Date().toISOString().split('T')[0]}.json`;
  exportToJson(companies, { ...options, filename });
}

export function exportHistoryToJson(companies: Company[], options?: ExportOptions): void {
  const filename = options?.filename || `historico-opencnpj-${new Date().toISOString().split('T')[0]}.json`;
  exportToJson(companies, { ...options, filename });
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Utility function to prepare company data for export (remove undefined values, etc.)
export function sanitizeCompanyData(company: Company): Company {
  return JSON.parse(JSON.stringify(company, (key, value) => {
    // Remove undefined values and empty arrays/objects
    if (value === undefined) return undefined;
    if (Array.isArray(value) && value.length === 0) return undefined;
    if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return undefined;
    return value;
  }));
}

// Convert company data to a more readable format for export
export function formatCompanyForExport(company: Company, locale: string = 'pt-BR'): any {
  const labels = locale === 'pt-BR' ? {
    cnpj: 'CNPJ',
    razaoSocial: 'Razão Social',
    nomeFantasia: 'Nome Fantasia',
    situacao: 'Situação',
    dataSituacao: 'Data da Situação',
    matrizOuFilial: 'Matriz/Filial',
    abertura: 'Data de Abertura',
    cnaePrincipal: 'CNAE Principal',
    cnaesSecundarios: 'CNAEs Secundários',
    naturezaJuridica: 'Natureza Jurídica',
    endereco: 'Endereço',
    email: 'E-mail',
    telefones: 'Telefones',
    capitalSocial: 'Capital Social',
    porte: 'Porte da Empresa',
    socios: 'Quadro Societário',
  } : {
    cnpj: 'CNPJ',
    razaoSocial: 'Company Name',
    nomeFantasia: 'Trade Name',
    situacao: 'Status',
    dataSituacao: 'Status Date',
    matrizOuFilial: 'Head Office/Branch',
    abertura: 'Opening Date',
    cnaePrincipal: 'Main CNAE',
    cnaesSecundarios: 'Secondary CNAEs',
    naturezaJuridica: 'Legal Nature',
    endereco: 'Address',
    email: 'Email',
    telefones: 'Phones',
    capitalSocial: 'Share Capital',
    porte: 'Company Size',
    socios: 'Partners',
  };

  const formatted: any = {};

  Object.entries(company).forEach(([key, value]) => {
    const label = labels[key as keyof typeof labels] || key;
    
    if (value !== undefined && value !== null) {
      if (key === 'endereco' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const endereco = value as any;
        formatted[label] = {
          [locale === 'pt-BR' ? 'Logradouro' : 'Street']: endereco.logradouro,
          [locale === 'pt-BR' ? 'Número' : 'Number']: endereco.numero,
          [locale === 'pt-BR' ? 'Complemento' : 'Complement']: endereco.complemento,
          [locale === 'pt-BR' ? 'Bairro' : 'Neighborhood']: endereco.bairro,
          [locale === 'pt-BR' ? 'Município' : 'City']: endereco.municipio,
          [locale === 'pt-BR' ? 'UF' : 'State']: endereco.uf,
          [locale === 'pt-BR' ? 'CEP' : 'ZIP Code']: endereco.cep,
        };
      } else if (key === 'telefones' && Array.isArray(value)) {
        formatted[label] = value.map((tel: any) => 
          `(${tel.ddd}) ${tel.numero}${tel.isFax ? ' (Fax)' : ''}`
        );
      } else if (key === 'socios' && Array.isArray(value)) {
        formatted[label] = value.map((socio: any) => ({
          [locale === 'pt-BR' ? 'Nome' : 'Name']: socio.nome,
          [locale === 'pt-BR' ? 'Documento' : 'Document']: socio.doc,
          [locale === 'pt-BR' ? 'Qualificação' : 'Role']: socio.qualificacao,
          [locale === 'pt-BR' ? 'Data de Entrada' : 'Entry Date']: socio.entrada,
          [locale === 'pt-BR' ? 'Tipo' : 'Type']: socio.tipo,
          [locale === 'pt-BR' ? 'Faixa Etária' : 'Age Range']: socio.faixaEtaria,
        }));
      } else {
        formatted[label] = value;
      }
    }
  });

  return formatted;
}