import { z } from 'zod';
import { getCNAEDescription } from './cnae-data';

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.opencnpj.org').replace(/\/$/, '');

export const CnpjSchema = z
  .string()
  .transform(v => v.replace(/\D/g, ''))
  .refine(v => /^\d{14}$/.test(v), 'CNPJ inválido');

async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('CNPJ não encontrado');
    }
    if (res.status === 429) {
      throw new Error('Muitas requisições. Tente novamente em alguns minutos');
    }
    if (res.status >= 500) {
      throw new Error('Erro no servidor. Tente novamente mais tarde');
    }
    
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}

// ===== Tipos CNAE =====
export type CNAEItem = {
  codigo: string;
  descricao: string;
};

export type NaturezaJuridica = {
  codigo: string;
  descricao: string;
};

// ===== Tipos modelados a partir da documentação pública da API =====
// GET https://api.opencnpj.org/{CNPJ}
// Campos vêm em snake_case; mapeamos para camelCase no front
export type CompanyApi = {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  situacao_cadastral?: string;
  data_situacao_cadastral?: string;
  matriz_filial?: string;
  data_inicio_atividade?: string;
  cnae_principal?: string | { codigo: string; descricao: string };
  cnaes_secundarios?: (string | { codigo: string; descricao: string })[];
  natureza_juridica?: string | { codigo: string; descricao: string };
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  uf?: string;
  municipio?: string;
  email?: string;
  telefones?: { ddd: string; numero: string; is_fax?: boolean }[];
  capital_social?: string;
  porte_empresa?: string;
  QSA?: {
    nome_socio: string;
    cnpj_cpf_socio?: string;
    qualificacao_socio?: string;
    data_entrada_sociedade?: string;
    identificador_socio?: string;
    faixa_etaria?: string;
  }[];
};

export type Company = {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  situacao?: string;
  dataSituacao?: string;
  matrizOuFilial?: string;
  abertura?: string;
  cnaePrincipal?: CNAEItem;
  cnaesSecundarios?: CNAEItem[];
  naturezaJuridica?: NaturezaJuridica;
  endereco?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    municipio?: string;
    uf?: string;
    cep?: string;
    lat?: number;
    lng?: number;
  };
  email?: string;
  telefones?: { ddd: string; numero: string; isFax?: boolean }[];
  capitalSocial?: string;
  porte?: string;
  socios?: {
    nome: string;
    doc?: string;
    qualificacao?: string;
    entrada?: string;
    tipo?: string;
    faixaEtaria?: string;
  }[];
};

export type ApiInfo = {
  total: number;
  last_updated: string;
  zip_size: number;
  zip_url: string;
  zip_md5checksum: string;
};

// Helper para parsear CNAE (pode vir como string "codigo - descricao" ou objeto)
function parseCNAE(cnae: string | { codigo: string; descricao: string } | undefined): CNAEItem | undefined {
  if (!cnae) return undefined;
  
  if (typeof cnae === 'object') {
    return { codigo: cnae.codigo, descricao: cnae.descricao };
  }
  
  // Se for string no formato "codigo - descricao"
  const match = cnae.match(/^([\d-]+)\s*-\s*(.+)$/);
  if (match) {
    return { codigo: match[1].trim(), descricao: match[2].trim() };
  }
  
  // Se for apenas código, busca a descrição no dicionário
  const descricao = getCNAEDescription(cnae);
  return { codigo: cnae, descricao };
}

// Helper para parsear Natureza Jurídica
function parseNaturezaJuridica(nj: string | { codigo: string; descricao: string } | undefined): NaturezaJuridica | undefined {
  if (!nj) return undefined;
  
  if (typeof nj === 'object') {
    return { codigo: nj.codigo, descricao: nj.descricao };
  }
  
  // Se for string no formato "codigo - descricao"
  const match = nj.match(/^([\d-]+)\s*-\s*(.+)$/);
  if (match) {
    return { codigo: match[1].trim(), descricao: match[2].trim() };
  }
  
  return { codigo: '', descricao: nj };
}

function mapCompany(api: CompanyApi): Company {
  return {
    cnpj: api.cnpj,
    razaoSocial: api.razao_social,
    nomeFantasia: api.nome_fantasia,
    situacao: api.situacao_cadastral,
    dataSituacao: api.data_situacao_cadastral,
    matrizOuFilial: api.matriz_filial,
    abertura: api.data_inicio_atividade,
    cnaePrincipal: parseCNAE(api.cnae_principal),
    cnaesSecundarios: api.cnaes_secundarios?.map(parseCNAE).filter((c): c is CNAEItem => c !== undefined),
    naturezaJuridica: parseNaturezaJuridica(api.natureza_juridica),
    endereco: {
      logradouro: api.logradouro,
      numero: api.numero,
      complemento: api.complemento,
      bairro: api.bairro,
      cep: api.cep,
      uf: api.uf,
      municipio: api.municipio,
      // TODO: Implementar geocodificação para lat/lng
      lat: undefined,
      lng: undefined,
    },
    email: api.email,
    telefones: api.telefones?.map(t => ({
      ddd: t.ddd,
      numero: t.numero,
      isFax: t.is_fax,
    })),
    capitalSocial: api.capital_social,
    porte: api.porte_empresa,
    socios: api.QSA?.map(s => ({
      nome: s.nome_socio,
      doc: s.cnpj_cpf_socio,
      qualificacao: s.qualificacao_socio,
      entrada: s.data_entrada_sociedade,
      tipo: s.identificador_socio,
      faixaEtaria: s.faixa_etaria,
    })),
  };
}

export async function getCompanyByCNPJ(input: string): Promise<Company> {
  const cnpj = CnpjSchema.parse(input);
  const data = await fetcher<CompanyApi>(`/${cnpj}`);
  return mapCompany(data);
}

export async function getInfo(): Promise<ApiInfo> {
  // https://api.opencnpj.org/info -> data da última atualização, URL do ZIP e MD5
  return fetcher<ApiInfo>('/info');
}

export async function searchCompanies(_query: string): Promise<Company[]> {
  // Não há endpoint público de busca por nome/razão.
  // Fallback: use histórico local e filtros client-side.
  // TODO: Implementar busca local no histórico
  return [];
}

export async function getTrending(): Promise<{ cnpj: string; razaoSocial: string }[]> {
  // Não há endpoint oficial; persista contagem local por CNPJ consultado.
  // TODO: Implementar contagem local de acessos
  return [];
}