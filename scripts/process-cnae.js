/**
 * Script para processar o JSON da API do IBGE e gerar dicionário TypeScript
 * Uso: node scripts/process-cnae.js
 */

const fs = require('fs');
const path = require('path');

// Ler o arquivo JSON da API do IBGE
const rawData = fs.readFileSync(path.join(__dirname, '../lib/cnae-ibge-raw.json'), 'utf8');
const cnaes = JSON.parse(rawData);

console.log(`Total de CNAEs encontrados: ${cnaes.length}`);

// Processar CNAEs
const cnaeDict = {};
let processedCount = 0;

cnaes.forEach(cnae => {
  if (cnae.id && cnae.descricao) {
    // Remover formatação do código (transformar "0111-3/01" em "0111301")
    const codigo = cnae.id.replace(/[^0-9]/g, '');
    
    // Limpar descrição (remover espaços extras)
    const descricao = cnae.descricao.trim();
    
    cnaeDict[codigo] = descricao;
    processedCount++;
  }
});

console.log(`CNAEs processados com sucesso: ${processedCount}`);

// Gerar arquivo TypeScript
const tsContent = `/**
 * Tabela COMPLETA de CNAEs - Gerada automaticamente
 * Fonte: API do IBGE - CNAE 2.3
 * Data de geração: ${new Date().toISOString()}
 * Total de CNAEs: ${processedCount}
 */

export const CNAE_COMPLETO: Record<string, string> = ${JSON.stringify(cnaeDict, null, 2)};

/**
 * Busca a descrição de um CNAE
 * @param codigo - Código do CNAE (com ou sem formatação)
 * @returns Descrição do CNAE ou undefined
 */
export function getCNAEFromCompleto(codigo: string): string | undefined {
  const cleanCode = codigo.replace(/[^0-9]/g, '');
  return CNAE_COMPLETO[cleanCode];
}

/**
 * Total de CNAEs disponíveis
 */
export const TOTAL_CNAES = ${processedCount};

/**
 * Busca CNAEs por descrição (pesquisa parcial)
 * @param termo - Termo de busca
 * @param limite - Número máximo de resultados
 * @returns Array de CNAEs encontrados
 */
export function buscarCNAE(termo: string, limite: number = 10): Array<{ codigo: string; descricao: string }> {
  const termoLower = termo.toLowerCase();
  const resultados: Array<{ codigo: string; descricao: string }> = [];
  
  for (const [codigo, descricao] of Object.entries(CNAE_COMPLETO)) {
    if (descricao.toLowerCase().includes(termoLower)) {
      resultados.push({ codigo, descricao });
      if (resultados.length >= limite) break;
    }
  }
  
  return resultados;
}
`;

// Salvar arquivo
const outputPath = path.join(__dirname, '../lib/cnae-completo.ts');
fs.writeFileSync(outputPath, tsContent, 'utf8');

console.log(`✅ Arquivo gerado com sucesso: ${outputPath}`);
console.log(`📊 Total de CNAEs: ${processedCount}`);
console.log(`📦 Tamanho do arquivo: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
