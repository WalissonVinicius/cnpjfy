import type { Company } from '../api';

export interface CsvExportOptions {
  filename?: string;
  delimiter?: string;
  includeHeaders?: boolean;
  locale?: string;
}

export function exportToCsv(
  companies: Company[],
  options: CsvExportOptions = {}
): void {
  const {
    filename = `opencnpj-export-${new Date().toISOString().split('T')[0]}.csv`,
    delimiter = ',',
    includeHeaders = true,
    locale = 'pt-BR',
  } = options;

  const csvContent = generateCsvContent(companies, delimiter, includeHeaders, locale);
  downloadCsvFile(csvContent, filename);
}

export function exportCompanyToCsv(company: Company, options?: CsvExportOptions): void {
  const filename = options?.filename || `empresa-${company.cnpj}-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCsv([company], { ...options, filename });
}

export function exportComparisonToCsv(companies: Company[], options?: CsvExportOptions): void {
  const filename = options?.filename || `comparacao-empresas-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCsv(companies, { ...options, filename });
}

export function exportHistoryToCsv(companies: Company[], options?: CsvExportOptions): void {
  const filename = options?.filename || `historico-opencnpj-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCsv(companies, { ...options, filename });
}

function generateCsvContent(
  companies: Company[],
  delimiter: string,
  includeHeaders: boolean,
  locale: string
): string {
  if (companies.length === 0) return '';

  const headers = getHeaders(locale);
  const rows = companies.map(company => formatCompanyRow(company, delimiter));

  const csvLines: string[] = [];
  
  if (includeHeaders) {
    csvLines.push(headers.join(delimiter));
  }
  
  csvLines.push(...rows);
  
  return csvLines.join('\n');
}

function getHeaders(locale: string): string[] {
  return locale === 'pt-BR' ? [
    'CNPJ',
    'Razão Social',
    'Nome Fantasia',
    'Situação',
    'Data da Situação',
    'Matriz/Filial',
    'Data de Abertura',
    'CNAE Principal',
    'CNAEs Secundários',
    'Natureza Jurídica',
    'Logradouro',
    'Número',
    'Complemento',
    'Bairro',
    'Município',
    'UF',
    'CEP',
    'E-mail',
    'Telefones',
    'Capital Social',
    'Porte da Empresa',
    'Sócios',
  ] : [
    'CNPJ',
    'Company Name',
    'Trade Name',
    'Status',
    'Status Date',
    'Head Office/Branch',
    'Opening Date',
    'Main CNAE',
    'Secondary CNAEs',
    'Legal Nature',
    'Street',
    'Number',
    'Complement',
    'Neighborhood',
    'City',
    'State',
    'ZIP Code',
    'Email',
    'Phones',
    'Share Capital',
    'Company Size',
    'Partners',
  ];
}

function formatCompanyRow(company: Company, delimiter: string): string {
  const values = [
    company.cnpj || '',
    company.razaoSocial || '',
    company.nomeFantasia || '',
    company.situacao || '',
    company.dataSituacao || '',
    company.matrizOuFilial || '',
    company.abertura || '',
    company.cnaePrincipal?.descricao || company.cnaePrincipal?.codigo || '',
    company.cnaesSecundarios?.map(cnae => cnae.descricao || cnae.codigo).join('; ') || '',
    company.naturezaJuridica?.descricao || company.naturezaJuridica?.codigo || '',
    company.endereco?.logradouro || '',
    company.endereco?.numero || '',
    company.endereco?.complemento || '',
    company.endereco?.bairro || '',
    company.endereco?.municipio || '',
    company.endereco?.uf || '',
    company.endereco?.cep || '',
    company.email || '',
    company.telefones?.map(tel => `(${tel.ddd}) ${tel.numero}${tel.isFax ? ' (Fax)' : ''}`).join('; ') || '',
    company.capitalSocial || '',
    company.porte || '',
    company.socios?.map(socio => `${socio.nome} (${socio.qualificacao || 'N/A'})`).join('; ') || '',
  ];

  return values.map(value => escapeCsvValue(value, delimiter)).join(delimiter);
}

function escapeCsvValue(value: string, delimiter: string): string {
  // If the value contains the delimiter, newlines, or quotes, wrap it in quotes
  if (value.includes(delimiter) || value.includes('\n') || value.includes('\r') || value.includes('"')) {
    // Escape existing quotes by doubling them
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  
  return value;
}

function downloadCsvFile(content: string, filename: string): void {
  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
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

// Generate CSV for partners table specifically
export function exportPartnersToCsv(
  partners: Company['socios'],
  companyName: string,
  options: CsvExportOptions = {}
): void {
  if (!partners || partners.length === 0) return;

  const {
    filename = `socios-${companyName.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`,
    delimiter = ',',
    includeHeaders = true,
    locale = 'pt-BR',
  } = options;

  const headers = locale === 'pt-BR' ? [
    'Nome do Sócio',
    'CPF/CNPJ',
    'Qualificação',
    'Data de Entrada',
    'Tipo',
    'Faixa Etária',
  ] : [
    'Partner Name',
    'CPF/CNPJ',
    'Role',
    'Entry Date',
    'Type',
    'Age Range',
  ];

  const rows = partners.map(partner => [
    partner.nome || '',
    partner.doc || '',
    partner.qualificacao || '',
    partner.entrada || '',
    partner.tipo || '',
    partner.faixaEtaria || '',
  ].map(value => escapeCsvValue(value, delimiter)).join(delimiter));

  const csvLines: string[] = [];
  
  if (includeHeaders) {
    csvLines.push(headers.join(delimiter));
  }
  
  csvLines.push(...rows);
  
  const csvContent = csvLines.join('\n');
  downloadCsvFile(csvContent, filename);
}