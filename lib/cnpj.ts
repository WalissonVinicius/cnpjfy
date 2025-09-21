import { z } from 'zod';

export const cnpjClean = (v: string): string => v.replace(/\D/g, '');

export const cnpjMask = (v: string): string =>
  cnpjClean(v)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);

export const CNPJ = z
  .string()
  .transform(cnpjClean)
  .refine(v => /^\d{14}$/.test(v), 'CNPJ inválido')
  .refine(validateCnpj, 'CNPJ inválido');

function validateCnpj(cnpj: string): boolean {
  if (cnpj.length !== 14) return false;
  
  // Elimina CNPJs conhecidos como inválidos
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Valida DVs
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1));
}

export const formatCnpj = (cnpj: string): string => {
  const cleaned = cnpjClean(cnpj);
  if (cleaned.length !== 14) return cnpj;
  return cnpjMask(cleaned);
};

export const isValidCnpj = (cnpj: string): boolean => {
  try {
    CNPJ.parse(cnpj);
    return true;
  } catch {
    return false;
  }
};