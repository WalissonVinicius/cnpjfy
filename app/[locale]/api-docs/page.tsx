'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, BookOpen, Code, Globe, Zap, Shield, ExternalLink, Github } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ApiDocsPageProps {
  params: { locale: string };
}

export default function ApiDocsPage({ params }: ApiDocsPageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(`${language}-${Date.now()}`);
      toast({
        title: "Código copiado!",
        description: `Exemplo em ${language} copiado para a área de transferência.`,
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código.",
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
              <span className="text-sm font-medium text-brand-600 dark:text-brand-400">Documentação Técnica</span>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-600 via-purple-600 to-accent-500 bg-clip-text text-transparent">
              API OpenCNPJ
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Documentação completa da API pública para consulta de dados empresariais brasileiros. 
              Gratuita, rápida e sem necessidade de autenticação.
            </p>
          </div>

          {/* Quick Start */}
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <Zap className="h-6 w-6 text-brand-500" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">URL Base</h3>
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg border">
                    <code className="text-sm font-mono text-brand-600 dark:text-brand-400">
                      https://opencnpj.com/api
                    </code>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Autenticação</h3>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      ✅ Não requer autenticação
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      ✅ Completamente gratuita
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      ⚡ Rate limit: 50 req/s
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endpoints */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              📡 Endpoints Disponíveis
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
                
                <h3 className="text-xl font-semibold mb-3">Consultar Empresa por CNPJ</h3>
                <p className="text-muted-foreground mb-6">
                  Retorna informações completas de uma empresa brasileira através do seu CNPJ.
                </p>

                {/* Parâmetros */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3">Parâmetros</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">Parâmetro</th>
                          <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">Tipo</th>
                          <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">Obrigatório</th>
                          <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">Descrição</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-200 dark:border-gray-700 p-3 font-mono">cnpj</td>
                          <td className="border border-gray-200 dark:border-gray-700 p-3">string</td>
                          <td className="border border-gray-200 dark:border-gray-700 p-3">✅ Sim</td>
                          <td className="border border-gray-200 dark:border-gray-700 p-3">CNPJ da empresa (com ou sem formatação). Deve conter 14 dígitos.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Exemplo de Requisição */}
                <div className="mb-6">
                  <CodeBlock
                    title="Exemplo de Requisição"
                    language="curl"
                    code={`curl -X GET "https://opencnpj.com/api/11222333000181" \\
  -H "Accept: application/json"`}
                  />
                </div>

                {/* Exemplo de Resposta */}
                <div className="mb-6">
                  <CodeBlock
                    title="Exemplo de Resposta (200 OK)"
                    language="json"
                    code={`{
  "cnpj": "11.222.333/0001-81",
  "identificador_matriz_filial": 1,
  "descricao_matriz_filial": "MATRIZ",
  "razao_social": "EMPRESA EXEMPLO LTDA",
  "nome_fantasia": "EXEMPLO",
  "situacao_cadastral": 2,
  "descricao_situacao_cadastral": "ATIVA",
  "data_situacao_cadastral": "2020-01-15",
  "motivo_situacao_cadastral": 0,
  "nome_cidade_exterior": null,
  "codigo_natureza_juridica": 2062,
  "data_inicio_atividade": "2020-01-15",
  "cnae_fiscal": 6201500,
  "cnae_fiscal_descricao": "Desenvolvimento de programas de computador sob encomenda",
  "descricao_tipo_logradouro": "RUA",
  "logradouro": "DAS FLORES",
  "numero": "123",
  "complemento": "SALA 456",
  "bairro": "CENTRO",
  "cep": "01234567",
  "uf": "SP",
  "codigo_municipio": 7107,
  "municipio": "SAO PAULO",
  "ddd_telefone_1": "11987654321",
  "ddd_telefone_2": null,
  "ddd_fax": null,
  "qualificacao_do_responsavel": 10,
  "capital_social": 50000.00,
  "porte": "05",
  "descricao_porte": "DEMAIS",
  "opcao_pelo_simples": true,
  "data_opcao_pelo_simples": "2020-02-01",
  "data_exclusao_do_simples": null,
  "opcao_pelo_mei": false,
  "situacao_especial": null,
  "data_situacao_especial": null
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
                    code={`curl -X GET "https://opencnpj.com/api/info" \\
  -H "Accept: application/json"`}
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
              📊 Códigos de Status HTTP
            </h2>
            
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border border-gray-200 dark:border-gray-700 p-4 text-left">Código</th>
                        <th className="border border-gray-200 dark:border-gray-700 p-4 text-left">Status</th>
                        <th className="border border-gray-200 dark:border-gray-700 p-4 text-left">Descrição</th>
                        <th className="border border-gray-200 dark:border-gray-700 p-4 text-left">Possíveis Causas</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-mono text-green-600">200</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-medium">OK</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">Requisição processada com sucesso</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">CNPJ válido e encontrado na base</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-mono text-yellow-600">400</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-medium">Bad Request</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">Parâmetros inválidos na requisição</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">CNPJ com formato inválido ou ausente</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-mono text-red-600">404</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-medium">Not Found</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">CNPJ não encontrado na base</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">CNPJ inexistente ou não cadastrado na Receita Federal</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-mono text-orange-600">429</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-medium">Too Many Requests</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">Limite de requisições excedido</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">Mais de 50 requisições por segundo do mesmo IP</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-mono text-red-600">500</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4 font-medium">Internal Server Error</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">Erro interno do servidor</td>
                        <td className="border border-gray-200 dark:border-gray-700 p-4">Problema temporário na infraestrutura</td>
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
              💻 Exemplos de Implementação
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
                  title="Usando fetch (nativo)"
                  language="javascript"
                  code={`async function consultarCNPJ(cnpj) {
  try {
    const response = await fetch(\`https://opencnpj.com/api/\${cnpj}\`, {
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
    console.log('Empresa encontrada:', empresa);
    return empresa;
  } catch (error) {
    console.error('Erro ao consultar CNPJ:', error);
    throw error;
  }
}

// Uso
consultarCNPJ('11222333000181')
  .then(empresa => {
    console.log(\`Razão Social: \${empresa.razao_social}\`);
    console.log(\`CNAE: \${empresa.cnae_fiscal_descricao}\`);
  })
  .catch(error => {
    console.error('Falha na consulta:', error);
  });`}
                />

                <CodeBlock
                  title="Usando axios"
                  language="javascript"
                  code={`const axios = require('axios');

// Configuração do cliente
const apiClient = axios.create({
  baseURL: 'https://opencnpj.com/api',
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'MeuApp/1.0'
  }
});

// Interceptor para retry automático
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
      throw new Error('CNPJ não encontrado');
    } else if (error.response?.status === 400) {
      throw new Error('CNPJ inválido');
    } else {
      throw new Error('Erro na consulta: ' + error.message);
    }
  }
}

// Uso
consultarCNPJ('11222333000181')
  .then(empresa => {
    console.log(\`Empresa: \${empresa.razao_social}\`);
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
                  title="Implementação completa com requests"
                  language="python"
                  code={`import requests
import time
from typing import Optional, Dict, Any

class OpenCNPJClient:
    def __init__(self, base_url: str = "https://opencnpj.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Accept': 'application/json',
            'User-Agent': 'MeuApp/1.0'
        })
        self.session.timeout = 30

    def consultar_cnpj(self, cnpj: str) -> Optional[Dict[str, Any]]:
        """
        Consulta informações de uma empresa pelo CNPJ
        
        Args:
            cnpj (str): CNPJ da empresa (com ou sem formatação)
            
        Returns:
            Dict com informações da empresa ou None se não encontrada
            
        Raises:
            ValueError: Se o CNPJ for inválido
            requests.RequestException: Se houver erro na requisição
        """
        # Remove formatação do CNPJ
        cnpj_limpo = ''.join(filter(str.isdigit, cnpj))
        
        if not self.validar_cnpj(cnpj_limpo):
            raise ValueError("CNPJ inválido")
        
        url = f"{self.base_url}/{cnpj_limpo}"
        
        try:
            response = self.session.get(url)
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                return None
            elif response.status_code == 429:
                # Rate limit - aguarda e tenta novamente
                time.sleep(2)
                response = self.session.get(url)
                if response.status_code == 200:
                    return response.json()
                else:
                    response.raise_for_status()
            else:
                response.raise_for_status()
                
        except requests.RequestException as e:
            raise requests.RequestException(f"Erro na consulta: {e}")

    def obter_info(self) -> Dict[str, Any]:
        """Obtém informações sobre a base de dados"""
        url = f"{self.base_url}/info"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()

    def validar_cnpj(self, cnpj: str) -> bool:
        """Valida se o CNPJ possui formato correto"""
        return len(cnpj) == 14 and cnpj.isdigit()

# Exemplo de uso
if __name__ == "__main__":
    client = OpenCNPJClient()
    
    try:
        # Consultar empresa
        empresa = client.consultar_cnpj("11.222.333/0001-81")
        
        if empresa:
            print(f"Razão Social: {empresa['razao_social']}")
            print(f"CNAE: {empresa['cnae_fiscal_descricao']}")
            print(f"Situação: {empresa['descricao_situacao_cadastral']}")
        else:
            print("Empresa não encontrada")
            
        # Obter informações da base
        info = client.obter_info()
        print(f"Última atualização: {info['ultima_atualizacao']}")
        
    except ValueError as e:
        print(f"Erro de validação: {e}")
    except requests.RequestException as e:
        print(f"Erro na requisição: {e}")`}
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
                  title="Implementação com HttpClient (Java 11+)"
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
        this.baseUrl = "https://opencnpj.com/api";
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();
        this.objectMapper = new ObjectMapper();
    }

    public JsonNode consultarCNPJ(String cnpj) throws Exception {
        // Remove formatação do CNPJ
        String cnpjLimpo = cnpj.replaceAll("[^0-9]", "");
        
        if (!validarCNPJ(cnpjLimpo)) {
            throw new IllegalArgumentException("CNPJ inválido");
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
                    // Rate limit - aguarda e tenta novamente
                    Thread.sleep(2000);
                    HttpResponse<String> retryResponse = httpClient.send(request,
                        HttpResponse.BodyHandlers.ofString());
                    if (retryResponse.statusCode() == 200) {
                        return objectMapper.readTree(retryResponse.body());
                    }
                    throw new RuntimeException("Rate limit excedido");
                default:
                    throw new RuntimeException("Erro HTTP: " + response.statusCode());
            }
        } catch (Exception e) {
            throw new Exception("Erro na consulta: " + e.getMessage(), e);
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
            throw new RuntimeException("Erro HTTP: " + response.statusCode());
        }
    }

    private boolean validarCNPJ(String cnpj) {
        return cnpj != null && cnpj.length() == 14 && cnpj.matches("\\\\d+");
    }

    // Exemplo de uso
    public static void main(String[] args) {
        OpenCNPJClient client = new OpenCNPJClient();

        try {
            // Consulta síncrona
            JsonNode empresa = client.consultarCNPJ("11.222.333/0001-81");
            
            if (empresa != null) {
                System.out.println("Razão Social: " + 
                    empresa.get("razao_social").asText());
                System.out.println("CNAE: " + 
                    empresa.get("cnae_fiscal_descricao").asText());
                
                // Processar sócios (QSA)
                if (empresa.has("QSA") && empresa.get("QSA").isArray()) {
                    System.out.println("Sócios:");
                    empresa.get("QSA").forEach(socio -> {
                        System.out.println("- " + socio.get("nome").asText());
                    });
                }
            } else {
                System.out.println("Empresa não encontrada");
            }

            // Consulta assíncrona
            client.consultarCNPJAsync("11222333000181")
                .thenAccept(result -> {
                    if (result != null) {
                        System.out.println("Consulta assíncrona concluída");
                    }
                })
                .join();

        } catch (Exception e) {
            System.err.println("Erro: " + e.getMessage());
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
              🔧 Guia de Integração
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Boas Práticas */}
              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-xl font-semibold text-green-600 dark:text-green-400">
                    ✅ Boas Práticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Implemente cache local para evitar requisições desnecessárias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Valide o CNPJ antes de fazer a requisição</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Trate todos os códigos de erro adequadamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Use timeouts apropriados (30s recomendado)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Implemente retry com backoff exponencial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Monitore o rate limit através dos headers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* O que não fazer */}
              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-xl font-semibold text-red-600 dark:text-red-400">
                    ❌ Evite Fazer
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Não faça mais de 50 requisições por segundo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Não ignore os códigos de erro HTTP</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Não faça requisições paralelas excessivas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Não armazene dados por mais de 30 dias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Não use a API para scraping em massa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Não redistribua os dados sem autorização</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Limitações e Termos */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              ⚖️ Limitações e Termos de Uso
            </h2>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Limitações Técnicas</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>Rate Limit:</strong> 50 requisições/segundo por IP</li>
                      <li>• <strong>Timeout:</strong> 30 segundos por requisição</li>
                      <li>• <strong>Dados:</strong> Atualizados mensalmente</li>
                      <li>• <strong>Disponibilidade:</strong> 99.5% SLA (não garantido)</li>
                      <li>• <strong>Cache:</strong> Recomendado cache local de 24h</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Termos de Uso</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Uso gratuito para fins legítimos</li>
                      <li>• Proibido uso para spam ou atividades ilegais</li>
                      <li>• Dados são públicos da Receita Federal</li>
                      <li>• Sem garantias de disponibilidade</li>
                      <li>• Respeite os limites de rate limiting</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Suporte */}
          <section className="bg-gradient-to-r from-brand-50 to-accent-50 dark:from-brand-950/20 dark:to-accent-950/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">🤝 Suporte e Comunidade</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Precisa de ajuda? Encontrou um bug? Quer contribuir? Nossa comunidade está aqui para ajudar!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="outline" 
                asChild
                className="h-12 px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-brand-200 dark:border-brand-800 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/50 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <a href="https://github.com/Hitmasu/OpenCNPJ" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
              <Button 
                variant="outline" 
                asChild
                className="h-12 px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-red-200 dark:border-red-800 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <a href="https://github.com/Hitmasu/OpenCNPJ/issues" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Reportar Bug
                </a>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}