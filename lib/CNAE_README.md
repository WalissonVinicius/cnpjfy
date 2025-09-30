# Sistema de CNAEs

Este diretório contém o sistema completo de **Classificação Nacional de Atividades Econômicas (CNAE)** versão 2.3, mantido pelo IBGE.

## 📁 Arquivos

### ⭐ Arquivo Principal

- **`cnae-completo.ts`** - **ARQUIVO ÚNICO COM TUDO** ✅
  - 1.332 CNAEs completos
  - Todas as funções utilitárias
  - Documentação inline
  - Pronto para uso

### Arquivos de Suporte

- **`cnae-data.ts`** - Re-export para compatibilidade (opcional)
- **`cnae-ibge-raw.json`** - JSON original da API (backup)
- **`CNAE_README.md`** - Esta documentação

## 🚀 Uso Rápido

```typescript
// ✅ RECOMENDADO: Importe diretamente do arquivo completo
import {
  getCNAEDescription,
  buscarCNAE,
  formatCNAECode,
  CNAE_COMPLETO,
  TOTAL_CNAES,
} from "@/lib/cnae-completo";

// Buscar descrição por código
const desc = getCNAEDescription("6203100");
// "DESENVOLVIMENTO E LICENCIAMENTO DE PROGRAMAS DE COMPUTADOR NÃO CUSTOMIZÁVEIS"

// Buscar CNAEs por descrição
const resultados = buscarCNAE("software", 5);
// [{ codigo: '6201501', descricao: '...' }, ...]

// Formatar código
const formatado = formatCNAECode("6203100");
// "6203-1/00"

// Verificar se CNAE é válido
const valido = isCNAEValido("6203100"); // true

// Buscar por seção
const cnaesDeInformacao = buscarPorSecao("J"); // Seção J - Informação e Comunicação

// Obter todos os CNAEs
const todos = getAllCNAEs(); // Array com 1.332 CNAEs
```

## 📊 Dados

- **Total de CNAEs**: 1.332 subclasses oficiais
- **Fonte**: [API do IBGE - CNAE 2.3](https://servicodados.ibge.gov.br/api/v2/cnae/subclasses)
- **Última atualização**: 30/09/2025
- **Cobertura**: 100% das subclasses CNAE 2.3

## 🔄 Atualizar Dados

Para atualizar os CNAEs com a versão mais recente do IBGE:

```bash
# 1. Baixar dados atualizados da API do IBGE
Invoke-WebRequest -Uri "https://servicodados.ibge.gov.br/api/v2/cnae/subclasses" -OutFile "lib/cnae-ibge-raw.json"

# 2. Processar e gerar arquivo TypeScript
node scripts/process-cnae.js
```

Isso irá:

1. Baixar os 1.332 CNAEs da API oficial do IBGE
2. Processar e limpar os dados
3. Gerar o arquivo `lib/cnae-completo.ts` atualizado
4. Incluir todas as funções utilitárias

## 📝 Estrutura do Código CNAE

O código CNAE possui **7 dígitos**:

```
6203-1/00
││││ │ ││
││││ │ └└─ Atividade específica (2 dígitos)
││││ └──── Subclasse (1 dígito)
└└└└───── Classe (4 dígitos)
```

**Exemplo**: `6203-1/00` → Armazenado como `6203100`

## 🔍 Funções Disponíveis

### `getCNAEDescription(codigo: string): string`

Retorna a descrição de um CNAE pelo código.

- Aceita códigos com ou sem formatação
- Fallback inteligente para códigos incompletos

### `buscarCNAE(termo: string, limite?: number)`

Busca CNAEs por descrição (pesquisa textual).

- Retorna array de objetos `{ codigo, descricao }`
- Limite padrão: 10 resultados

### `formatCNAECode(codigo: string): string`

Formata o código no padrão oficial `0000-0/00`.

### `isCNAEValido(codigo: string): boolean`

Verifica se um código CNAE existe na base.

### `getAllCNAEs(): Array<{codigo, descricao}>`

Retorna todos os 1.332 CNAEs como array.

### `buscarPorSecao(secao: string): Array<{codigo, descricao}>`

Busca CNAEs por seção (A-U).

## 📚 Fontes Oficiais

1. **IBGE/CONCLA**: https://cnae.ibge.gov.br/
2. **API do IBGE**: https://servicodados.ibge.gov.br/api/docs/cnae
3. **Receita Federal**: Dados abertos do CNPJ

## 🎯 Seções CNAE

A CNAE 2.3 está organizada em **21 seções** (A-U):

- **A**: Agricultura, Pecuária, Produção Florestal, Pesca e Aquicultura
- **B**: Indústrias Extrativas
- **C**: Indústrias de Transformação
- **D**: Eletricidade e Gás
- **E**: Água, Esgoto, Atividades de Gestão de Resíduos
- **F**: Construção
- **G**: Comércio; Reparação de Veículos
- **H**: Transporte, Armazenagem e Correio
- **I**: Alojamento e Alimentação
- **J**: Informação e Comunicação
- **K**: Atividades Financeiras, de Seguros e Serviços Relacionados
- **L**: Atividades Imobiliárias
- **M**: Atividades Profissionais, Científicas e Técnicas
- **N**: Atividades Administrativas e Serviços Complementares
- **O**: Administração Pública, Defesa e Seguridade Social
- **P**: Educação
- **Q**: Saúde Humana e Serviços Sociais
- **R**: Artes, Cultura, Esporte e Recreação
- **S**: Outras Atividades de Serviços
- **T**: Serviços Domésticos
- **U**: Organismos Internacionais e Outras Instituições Extraterritoriais

## ⚙️ Script de Processamento

O arquivo `scripts/process-cnae.js` realiza:

- Download e parse do JSON da API
- Limpeza dos códigos (remove formatação)
- Geração do arquivo TypeScript completo
- Adição de todas as funções utilitárias
- Validação e documentação dos dados

## 🚀 Arquitetura Simplificada

```
┌─────────────────────────────────────┐
│   lib/cnae-completo.ts              │
│   ================================   │
│   • 1.332 CNAEs                     │
│   • Todas as funções                │
│   • Documentação completa           │
│   • ARQUIVO ÚNICO                   │
└─────────────────────────────────────┘
              ▲
              │ importa
              │
┌─────────────┴───────────────────────┐
│  Seu código                          │
│  import { getCNAEDescription }       │
│  from '@/lib/cnae-completo'          │
└──────────────────────────────────────┘
```

## 🤝 Contribuindo

Se encontrar CNAEs faltantes ou descrições incorretas:

1. Verifique a fonte oficial no site do IBGE
2. Execute o script de atualização
3. Reporte problemas com a API do IBGE se necessário

## 📄 Licença

Os dados CNAE são de **domínio público** e mantidos pelo IBGE.
