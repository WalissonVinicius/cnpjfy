'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, BookOpen, Code, Globe, Zap, Shield, ExternalLink, Github, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n';

interface ApiDocsPageProps {
  params: { locale: string };
}

export default function ApiDocsPage({ params }: ApiDocsPageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation('apiDocs');

  const copyToClipboard = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(`${language}-${Date.now()}`);
      toast({
        title: t('codeCopied', 'Código copiado!'),
        description: t('codeCopiedDesc', `Exemplo em ${language} copiado para a área de transferência.`),
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast({
        title: t('copyError', 'Erro ao copiar'),
        description: t('copyErrorDesc', 'Não foi possível copiar o código.'),
        variant: "destructive",
      });
    }
  };

  const CodeBlock = ({ code, language, title }: { code: string; language: string; title: string }) => (
    <div className="relative group">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-medium">{title}</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(code, language)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          {copiedCode?.includes(language) ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 p-4 rounded-xl overflow-x-auto border border-gray-200 dark:border-gray-700">
        <pre className="text-sm text-gray-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-brand-500/10 to-accent-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-accent-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <div className="space-y-12">

          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-brand-500/10 to-accent-500/10 border border-brand-500/20 mb-4">
              <BookOpen className="h-4 w-4 mr-2 text-brand-600 dark:text-brand-400" />
              <span className="text-sm font-medium text-brand-600 dark:text-brand-400">{t('technicalDocs', 'Documentação Técnica')}</span>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-600 via-purple-600 to-accent-500 bg-clip-text text-transparent">
              {t('title', 'API OpenCNPJ')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('subtitle', 'Documentação completa da API pública para consulta de dados empresariais brasileiros. Gratuita, rápida e sem necessidade de autenticação.')}
            </p>
          </div>

          {/* Quick Start */}
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <Zap className="h-6 w-6 text-brand-500" />
                {t('quickStart', 'Quick Start')}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">{t('baseUrl', 'URL Base')}</h3>
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg border">
                    <code className="text-sm font-mono text-brand-600 dark:text-brand-400">
                      https://api.opencnpj.org
                    </code>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">{t('authentication', 'Autenticação')}</h3>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      ✅ {t('noAuth', 'Não requer autenticação')}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      ✅ {t('completelyFree', 'Completamente gratuita')}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      ⚡ {t('rateLimit', 'Rate limit: 50 req/s')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endpoints */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              📡 {t('availableEndpoints', 'Endpoints Disponíveis')}
            </h2>

            {/* Endpoint 1: Consultar Empresa */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1">
                    GET
                  </Badge>
                  <code className="text-lg font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                    /{'{cnpj}'}
                  </code>
                </div>

                <h3 className="text-xl font-semibold mb-3">{t('queryCompanyByCnpj', 'Consultar Empresa por CNPJ')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('queryCompanyDesc', 'Retorna informações completas de uma empresa brasileira através do seu CNPJ.')}
                </p>

                {/* Parâmetros */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3">{t('parameters', 'Parâmetros')}</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">{t('parameter', 'Parâmetro')}</th>
                          <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">{t('type', 'Tipo')}</th>
                          <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">{t('required', 'Obrigatório')}</th>
                          <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">{t('description', 'Descrição')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-200 dark:border-gray-700 p-3 font-mono">cnpj</td>
                          <td className="border border-gray-200 dark:border-gray-700 p-3">string</td>
                          <td className="border border-gray-200 dark:border-gray-700 p-3">✅ {t('yes', 'Sim')}</td>
                          <td className="border border-gray-200 dark:border-gray-700 p-3">{t('cnpjParamDesc', 'CNPJ da empresa (com ou sem formatação). Deve conter 14 dígitos.')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Exemplo de Requisição */}
                <div className="mb-6">
                  <CodeBlock
                    title={t('exampleRequest', 'Exemplo de Requisição')}
                    language="curl"
                    code={`curl -s "https://api.opencnpj.org/11222333000181" | jq`}
                  />
                </div>

                {/* Exemplo de Resposta */}
                <div className="mb-6">
                  <CodeBlock
                    title={t('exampleResponse', 'Exemplo de Resposta (200 OK)')}
                    language="json"
                    code={`{
  "cnpj": "00000000000000",
  "razao_social": "EMPRESA EXEMPLO LTDA",
  "nome_fantasia": "EXEMPLO",
  "situacao_cadastral": "Ativa",
  "data_situacao_cadastral": "2000-01-01",
  "matriz_filial": "Matriz",
  "data_inicio_atividade": "2000-01-01",
  "cnae_principal": "0000000",
  "cnaes_secundarios": [
    "0000001",
    "0000002"
  ],
  "cnaes_secundarios_count": 2,
  "natureza_juridica": "Sociedade Empresária Limitada",
  "logradouro": "RUA EXEMPLO",
  "numero": "123",
  "complemento": "SALA 1",
  "bairro": "BAIRRO EXEMPLO",
  "cep": "00000000",
  "uf": "SP",
  "municipio": "SAO PAULO",
  "email": "contato@exemplo.com",
  "telefones": [
    {
      "ddd": "11",
      "numero": "900000000",
      "is_fax": false
    }
  ],
  "capital_social": "1000,00",
  "porte_empresa": "Microempresa (ME)",
  "opcao_simples": null,
  "data_opcao_simples": null,
  "opcao_mei": null,
  "data_opcao_mei": null,
  "QSA": [
    {
      "nome_socio": "SOCIO PJ EXEMPLO",
      "cnpj_cpf_socio": "00000000000000",
      "qualificacao_socio": "Sócio Pessoa Jurídica",
      "data_entrada_sociedade": "2000-01-01",
      "identificador_socio": "Pessoa Jurídica",
      "faixa_etaria": "Não se aplica"
    },
    {
      "nome_socio": "SOCIA PF EXEMPLO",
      "cnpj_cpf_socio": "***000000**",
      "qualificacao_socio": "Administrador",
      "data_entrada_sociedade": "2000-01-01",
      "identificador_socio": "Pessoa Física",
      "faixa_etaria": "31 a 40 anos"
    }
  ]
}`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Endpoint 2: Informações da Base */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1">
                    GET
                  </Badge>
                  <code className="text-lg font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                    /info
                  </code>
                </div>

                <h3 className="text-xl font-semibold mb-3">Informações da Base de Dados</h3>
                <p className="text-muted-foreground mb-6">
                  Retorna informações sobre a base de dados, incluindo data da última atualização e estatísticas.
                </p>

                {/* Exemplo de Requisição */}
                <div className="mb-6">
                  <CodeBlock
                    title="Exemplo de Requisição"
                    language="curl"
                    code={`curl -s "https://api.opencnpj.org/info" | jq`}
                  />
                </div>

                {/* Exemplo de Resposta */}
                <div className="mb-6">
                  <CodeBlock
                    title="Exemplo de Resposta (200 OK)"
                    language="json"
                    code={`{
  "ultima_atualizacao": "2024-01-15T10:30:00Z",
  "total_empresas": 54789123,
  "empresas_ativas": 45123789,
  "versao_base": "2024.01",
  "fonte": "Receita Federal do Brasil",
  "status": "online"
}`}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Códigos de Status HTTP */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              📊 {t('httpStatusCodes', 'Códigos de Status HTTP')}
            </h2>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border border-gray-200 dark:border-gray-700 p-4 text-left">{t('statusCode', 'Código')}</th>
                        <th className="border border-gray-200 dark:border-gray-700 p-4 text-left">{t('status', 'Status')}</th>
                        <th className="border border-gray-200 dark:border-gray-700 p-4 text-left">{t('description', 'Descrição')}</th>
                        <th className="border border-gray-200 dark:border-gray-700 p-4 text-left">{t('possibleCauses', 'Possíveis Causas')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-mono text-green-600 dark:text-green-400">200</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 text-green-600 dark:text-green-400 font-medium">{t('success', 'Sucesso')}</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">{t('successDesc', 'Empresa encontrada e dados retornados')}</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 text-sm text-muted-foreground">{t('validRequest', 'Requisição válida com CNPJ existente')}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-mono text-yellow-600 dark:text-yellow-400">400</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 text-yellow-600 dark:text-yellow-400 font-medium">{t('badRequest', 'Requisição Inválida')}</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">{t('badRequestDesc', 'Parâmetros inválidos ou malformados')}</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 text-sm text-muted-foreground">{t('invalidCnpj', 'CNPJ com formato inválido ou ausente')}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-mono text-red-600 dark:text-red-400">404</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 text-red-600 dark:text-red-400 font-medium">{t('notFound', 'Não Encontrado')}</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">{t('notFoundDesc', 'CNPJ não encontrado na base de dados')}</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 text-sm text-muted-foreground">{t('cnpjNotExists', 'CNPJ não existe ou não está ativo')}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-mono text-orange-600 dark:text-orange-400">429</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 text-orange-600 dark:text-orange-400 font-medium">{t('tooManyRequests', 'Muitas Requisições')}</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">{t('tooManyRequestsDesc', 'Rate limit excedido')}</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 text-sm text-muted-foreground">{t('rateLimitExceeded', 'Mais de 50 requisições por segundo')}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-mono text-red-600 dark:text-red-400">500</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 text-red-600 dark:text-red-400 font-medium">{t('internalError', 'Erro Interno do Servidor')}</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">{t('internalErrorDesc', 'Erro interno temporário')}</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 text-sm text-muted-foreground">{t('serverIssue', 'Problema temporário no servidor')}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-mono text-red-600">503</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-medium">Service Unavailable</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">Serviço temporariamente indisponível</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">Manutenção programada ou sobrecarga</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Exemplos de Implementação */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              💻 {t('implementationExamples', 'Exemplos de Implementação')}
            </h2>

            {/* JavaScript */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-yellow-500">⚡</span>
                  JavaScript
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 space-y-6">
                <CodeBlock
                  title={t('fetchNative', 'Usando fetch (nativo)')}
                  language="javascript"
                  code={`async function consultarCNPJ(cnpj) {
  try {
    const response = await fetch(\`https://api.opencnpj.org/\${cnpj}\`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MeuApp/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const empresa = await response.json();
    console.log('${t('companyFound', 'Empresa encontrada:')}', empresa);
    return empresa;
  } catch (error) {
    console.error('${t('cnpjQueryError', 'Erro ao consultar CNPJ:')}', error);
    throw error;
  }
}

// ${t('usage', 'Uso')}
consultarCNPJ('11222333000181')
  .then(empresa => {
    console.log(\`${t('corporateName', 'Razão Social: ')}\${empresa.razao_social}\`);
    console.log(\`${t('cnae', 'CNAE: ')}\${empresa.cnae_principal}\`);
  })
  .catch(error => {
    console.error('${t('queryFailure', 'Falha na consulta:')}', error);
  });`}
                />

                <CodeBlock
                  title={t('usingAxios', 'Usando axios')}
                  language="javascript"
                  code={`const axios = require('axios');

// ${t('clientConfig', 'Configuração do cliente')}
const apiClient = axios.create({
  baseURL: 'https://api.opencnpj.org',
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'MeuApp/1.0'
  }
});

// ${t('autoRetryInterceptor', 'Interceptor para retry automático')}
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);

async function consultarCNPJ(cnpj) {
  try {
    const response = await apiClient.get(\`/\${cnpj}\`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('${t('cnpjNotFound', 'CNPJ não encontrado')}');
    } else if (error.response?.status === 400) {
      throw new Error('${t('invalidCnpj', 'CNPJ inválido')}');
    } else {
      throw new Error('${t('queryError', 'Erro na consulta: ')}' + error.message);
    }
  }
}

// ${t('usage', 'Uso')}
consultarCNPJ('11222333000181')
  .then(empresa => {
    console.log(\`${t('company', 'Empresa: ')}\${empresa.razao_social}\`);
  })
  .catch(error => {
    console.error(error.message);
  });`}
                />
              </CardContent>
            </Card>

            {/* Python */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-blue-500">🐍</span>
                  Python
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CodeBlock
                  title={t('completeImplementationRequests', 'Implementação completa com requests')}
                  language="python"
                  code={`import requests
import time
from typing import Optional, Dict, Any

class OpenCNPJClient:
    def __init__(self, base_url: str = "https://api.opencnpj.org"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Accept': 'application/json',
            'User-Agent': 'MeuApp/1.0'
        })
        self.session.timeout = 30

    def consultar_cnpj(self, cnpj: str) -> Optional[Dict[str, Any]]:
        """
        ${t('queryCompanyInfoByCnpj', 'Consulta informações de uma empresa pelo CNPJ')}
        
        Args:
            cnpj (str): ${t('companyCnpjWithOrWithoutFormat', 'CNPJ da empresa (com ou sem formatação)')}
            
        Returns:
            ${t('dictWithCompanyInfoOrNone', 'Dict com informações da empresa ou None se não encontrada')}
            
        Raises:
            ValueError: ${t('ifCnpjInvalid', 'Se o CNPJ for inválido')}
            requests.RequestException: ${t('ifRequestError', 'Se houver erro na requisição')}
        """
        # ${t('removeCnpjFormatting', 'Remove formatação do CNPJ')}
        cnpj_limpo = ''.join(filter(str.isdigit, cnpj))
        
        if not self.validar_cnpj(cnpj_limpo):
            raise ValueError("${t('invalidCnpj', 'CNPJ inválido')}")
        
        url = f"{self.base_url}/{cnpj_limpo}"
        
        try:
            response = self.session.get(url)
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                return None
            elif response.status_code == 429:
                # ${t('rateLimitWaitRetry', 'Rate limit - aguarda e tenta novamente')}
                time.sleep(2)
                response = self.session.get(url)
                if response.status_code == 200:
                    return response.json()
                else:
                    response.raise_for_status()
            else:
                response.raise_for_status()
                
        except requests.RequestException as e:
            raise requests.RequestException(f"${t('queryError', 'Erro na consulta: ')}{e}")

    def obter_info(self) -> Dict[str, Any]:
        """${t('getDatabaseInfo', 'Obtém informações sobre a base de dados')}"""
        url = f"{self.base_url}/info"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()

    def validar_cnpj(self, cnpj: str) -> bool:
        """${t('validateCnpjFormat', 'Valida se o CNPJ possui formato correto')}"""
        return len(cnpj) == 14 and cnpj.isdigit()

# ${t('usageExample', 'Exemplo de uso')}
if __name__ == "__main__":
    client = OpenCNPJClient()
    
    try:
        # ${t('queryCompany', 'Consultar empresa')}
        empresa = client.consultar_cnpj("11.222.333/0001-81")
        
        if empresa:
            print(f"${t('corporateName', 'Razão Social: ')}{empresa['razao_social']}")
            print(f"${t('cnae', 'CNAE: ')}{empresa['cnae_principal']}")
            print(f"${t('situation', 'Situação: ')}{empresa['situacao_cadastral']}")
        else:
            print("${t('companyNotFound', 'Empresa não encontrada')}")
            
        # ${t('getDatabaseInfo', 'Obter informações da base')}
        info = client.obter_info()
        print(f"${t('lastUpdate', 'Última atualização: ')}{info['ultima_atualizacao']}")
        
    except ValueError as e:
        print(f"${t('validationError', 'Erro de validação: ')}{e}")
    except requests.RequestException as e:
        print(f"${t('requestError', 'Erro na requisição: ')}{e}")`}
                />
              </CardContent>
            </Card>

            {/* Java */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-red-500">☕</span>
                  Java
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CodeBlock
                  title={t('httpClientImplementation', 'Implementação com HttpClient (Java 11+)')}
                  language="java"
                  code={`import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class OpenCNPJClient {
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String baseUrl;

    public OpenCNPJClient() {
        this.baseUrl = "https://api.opencnpj.org";
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();
        this.objectMapper = new ObjectMapper();
    }

    public JsonNode consultarCNPJ(String cnpj) throws Exception {
        // ${t('removeCnpjFormatting', 'Remove formatação do CNPJ')}
        String cnpjLimpo = cnpj.replaceAll("[^0-9]", "");
        
        if (!validarCNPJ(cnpjLimpo)) {
            throw new IllegalArgumentException("${t('invalidCnpj', 'CNPJ inválido')}");
        }

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(baseUrl + "/" + cnpjLimpo))
            .header("Accept", "application/json")
            .header("User-Agent", "MeuApp/1.0")
            .timeout(Duration.ofSeconds(30))
            .GET()
            .build();

        try {
            HttpResponse<String> response = httpClient.send(request,
                HttpResponse.BodyHandlers.ofString());

            switch (response.statusCode()) {
                case 200:
                    return objectMapper.readTree(response.body());
                case 404:
                    return null;
                case 429:
                    // ${t('rateLimitWaitRetry', 'Rate limit - aguarda e tenta novamente')}
                    Thread.sleep(2000);
                    HttpResponse<String> retryResponse = httpClient.send(request,
                        HttpResponse.BodyHandlers.ofString());
                    if (retryResponse.statusCode() == 200) {
                        return objectMapper.readTree(retryResponse.body());
                    }
                    throw new RuntimeException("${t('rateLimitExceeded', 'Rate limit excedido')}");
                default:
                    throw new RuntimeException("${t('httpError', 'Erro HTTP: ')}" + response.statusCode());
            }
        } catch (Exception e) {
            throw new Exception("${t('queryError', 'Erro na consulta: ')}" + e.getMessage(), e);
        }
    }

    public CompletableFuture<JsonNode> consultarCNPJAsync(String cnpj) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return consultarCNPJ(cnpj);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }

    public JsonNode obterInfo() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(baseUrl + "/info"))
            .header("Accept", "application/json")
            .timeout(Duration.ofSeconds(30))
            .GET()
            .build();

        HttpResponse<String> response = httpClient.send(request,
            HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            return objectMapper.readTree(response.body());
        } else {
            throw new RuntimeException("${t('httpError', 'Erro HTTP: ')}" + response.statusCode());
        }
    }

    private boolean validarCNPJ(String cnpj) {
        return cnpj != null && cnpj.length() == 14 && cnpj.matches("\\\\d+");
    }

    // ${t('usageExample', 'Exemplo de uso')}
    public static void main(String[] args) {
        OpenCNPJClient client = new OpenCNPJClient();

        try {
            // ${t('synchronousQuery', 'Consulta síncrona')}
            JsonNode empresa = client.consultarCNPJ("11.222.333/0001-81");
            
            if (empresa != null) {
                System.out.println("${t('corporateName', 'Razão Social: ')}" + 
                    empresa.get("razao_social").asText());
                System.out.println("${t('cnae', 'CNAE: ')}" + 
                    empresa.get("cnae_principal").asText());
                
                // ${t('processPartners', 'Processar sócios (QSA)')}
                if (empresa.has("QSA") && empresa.get("QSA").isArray()) {
                    System.out.println("${t('partners', 'Sócios:')}");
                    empresa.get("QSA").forEach(socio -> {
                        System.out.println("- " + socio.get("nome_socio").asText());
                    });
                }
            } else {
                System.out.println("${t('companyNotFound', 'Empresa não encontrada')}");
            }

            // ${t('asynchronousQuery', 'Consulta assíncrona')}
            client.consultarCNPJAsync("11222333000181")
                .thenAccept(result -> {
                    if (result != null) {
                        System.out.println("${t('asyncQueryCompleted', 'Consulta assíncrona concluída')}");
                    }
                })
                .join();

        } catch (Exception e) {
            System.err.println("${t('error', 'Erro: ')}" + e.getMessage());
        }
    }
}`}
                />
              </CardContent>
            </Card>
          </section>

          {/* Guia de Integração */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              🔧 {t('integrationGuide', 'Guia de Integração')}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Boas Práticas */}
              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-xl font-semibold text-green-600 dark:text-green-400">
                    ✅ {t('bestPractices', 'Boas Práticas')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{t('bestPractice1', 'Implemente cache local para evitar requisições desnecessárias')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{t('bestPractice2', 'Valide o CNPJ antes de fazer a requisição')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{t('bestPractice3', 'Trate todos os códigos de erro adequadamente')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{t('bestPractice4', 'Use timeouts apropriados (30s recomendado)')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{t('bestPractice5', 'Implemente retry com backoff exponencial')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{t('bestPractice6', 'Monitore o rate limit através dos headers')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* O que não fazer */}
              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-xl font-semibold text-red-600 dark:text-red-400">
                    ❌ {t('avoidDoing', 'Evite Fazer')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{t('avoidPractice1', 'Não faça mais de 50 requisições por segundo')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{t('avoidPractice2', 'Não ignore os códigos de erro HTTP')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{t('avoidPractice3', 'Não faça requisições paralelas excessivas')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{t('avoidPractice4', 'Não armazene dados por mais de 30 dias')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{t('avoidPractice5', 'Não use a API para scraping em massa')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{t('avoidPractice6', 'Não redistribua os dados sem autorização')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Limitações e Termos */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              ⚖️ {t('limitationsAndTerms', 'Limitações e Termos de Uso')}
            </h2>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t('technicalLimitations', 'Limitações Técnicas')}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>{t('rateLimit', 'Rate Limit')}:</strong> {t('rateLimitDesc', '50 requisições/segundo por IP')}</li>
                      <li>• <strong>{t('timeout', 'Timeout')}:</strong> {t('timeoutDesc', '30 segundos por requisição')}</li>
                      <li>• <strong>{t('data', 'Dados')}:</strong> {t('dataDesc', 'Atualizados mensalmente')}</li>
                      <li>• <strong>{t('availability', 'Disponibilidade')}:</strong> {t('availabilityDesc', '99.5% SLA (não garantido)')}</li>
                      <li>• <strong>{t('cache', 'Cache')}:</strong> {t('cacheDesc', 'Recomendado cache local de 24h')}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t('termsOfUse', 'Termos de Uso')}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• {t('term1', 'Uso gratuito para fins legítimos')}</li>
                      <li>• {t('term2', 'Proibido uso para spam ou atividades ilegais')}</li>
                      <li>• {t('term3', 'Dados são públicos da Receita Federal')}</li>
                      <li>• {t('term4', 'Sem garantias de disponibilidade')}</li>
                      <li>• {t('term5', 'Respeite os limites de rate limiting')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Suporte */}
          <section className="bg-gradient-to-r from-brand-100 to-accent-100 dark:from-brand-900/40 dark:to-accent-900/40 border border-brand-200/50 dark:border-brand-700/50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-brand-900 dark:text-brand-100">🤝 {t('supportCommunity', 'Suporte e Comunidade')}</h2>
            <p className="text-brand-700 dark:text-brand-300 mb-6 max-w-2xl mx-auto">
              {t('supportMessage', 'Precisa de ajuda? Nossa comunidade está aqui para apoiar!')}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800">
                <a href="https://github.com/Hitmasu/OpenCNPJ/issues" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('githubIssues', 'Reportar Bug')}
                </a>
              </Button>
              <Button variant="outline" className="bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800">
                <a href="https://github.com/Hitmasu/OpenCNPJ" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Github className="h-4 w-4 mr-2" />
                  {t('documentation', 'Documentação')}
                </a>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}