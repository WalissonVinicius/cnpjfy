/**
 * Re-exporta todas as funções de cnae-completo.ts
 * 
 * Este arquivo existe apenas para manter compatibilidade com código antigo.
 * Prefira importar diretamente de './cnae-completo'
 */

export {
  // Dicionários
  CNAE_COMPLETO,
  CNAE_DICTIONARY,
  
  // Constantes
  TOTAL_CNAES,
  
  // Funções principais
  getCNAEDescription,
  buscarCNAE,
  formatCNAECode,
  isCNAEValido,
  getAllCNAEs,
  buscarPorSecao,
  
  // Deprecated
  getCNAEFromCompleto,
} from './cnae-completo';