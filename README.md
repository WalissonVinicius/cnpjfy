# CNPJfy — O retrato inteligente do CNPJ

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)

**[🌐 Acesse o CNPJfy](https://www.cnpjfy.walisson.dev)** • **[📚 Documentação](#-funcionalidades)** • **[🐛 Issues](https://github.com/WalissonVinicius/cnpjfy/issues)**

</div>

> 🏢 Interface moderna e intuitiva para consulta gratuita de dados empresariais brasileiros com recursos avançados.

## 🚀 Rodando o projeto

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. **Clone e instale as dependências:**

   ```bash
   git clone https://github.com/WalissonVinicius/cnpjfy.git
   cd cnpjfy
   npm install
   ```

2. **Configure as variáveis de ambiente:**

   ```bash
   cp .env.example .env.local
   ```

   Edite o arquivo `.env.local` se necessário (por padrão usa a API pública do OpenCNPJ):

   ```env
   NEXT_PUBLIC_API_BASE_URL=https://api.opencnpj.org
   ```

3. **Execute o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

4. **Acesse:** http://localhost:3000

## 🌐 Demo Online

**[🚀 Acesse o CNPJfy](https://www.cnpjfy.walisson.dev)** - Versão em produção

## 🔌 Integração com API

### Endpoints utilizados

- **Consulta por CNPJ:** `GET https://api.opencnpj.org/{CNPJ}` (com/sem pontuação)
  - Retorna JSON em snake_case, mapeado para camelCase no frontend
  - Status: 200 (sucesso), 404 (não encontrado), 429 (rate limit)

- **Informações da base:** `GET https://api.opencnpj.org/info`
  - Última atualização, URL do ZIP e MD5 checksum

### Limitações conhecidas

- **Busca por nome/razão social:** Não existe endpoint público
  - Implementamos fallback client-side no histórico local
- **Trending/empresas populares:** Não há endpoint oficial
  - Contamos acessos localmente via IndexedDB

- **Rate limiting:** Até ~50 req/s por IP
  - Implementamos retry automático e cache local

## ✨ Funcionalidades

### 🌐 Internacionalização (i18n)

- **Idiomas:** Português (pt-BR) e Inglês (en-US)
- **Detecção automática** + seletor manual
- **Persistência** da preferência do usuário

### 📱 Progressive Web App (PWA)

- **Instalável** em dispositivos móveis e desktop
- **Funciona offline** para histórico e favoritos
- **Cache inteligente** das últimas consultas
- **Notificações** de status de conexão

### 💾 Armazenamento Local

- **IndexedDB:** Histórico completo, favoritos, cache de empresas
- **LocalStorage:** Preferências, tema, idioma
- **Limpeza automática** de dados antigos (configurável)

### 📊 Visualização de Dados

- **Interface moderna** com design system consistente
- **Tabelas responsivas** com paginação
- **Cards informativos** organizados por categoria
- **Timeline** de eventos da empresa

### 📤 Exportação

- **Formatos:** JSON, CSV
- **Dados individuais** ou comparação entre empresas
- **Histórico completo** exportável

### ⌨️ Atalhos de Teclado

- **Ctrl/Cmd + K:** Busca rápida
- **F:** Favoritar empresa (na página da empresa)
- **E:** Exportar dados
- **S:** Compartilhar

### 🎨 Interface

- **Tema escuro/claro** com detecção automática
- **Design responsivo** mobile-first
- **Acessibilidade** (ARIA, foco visível, contraste)
- **Componentes shadcn/ui** para consistência
- **Animações suaves** e transições elegantes

## 🏗️ Arquitetura

### Stack Tecnológica

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS + shadcn/ui
- **Ícones:** Lucide React
- **Estado:** React Query (TanStack Query)
- **Validação:** Zod
- **Armazenamento:** IndexedDB (idb) + LocalStorage
- **PWA:** Workbox (injectManifest)
- **Exportação:** SheetJS (XLSX), jsPDF
- **Testes:** Jest + Testing Library, Playwright
- **Qualidade:** ESLint + Prettier + Husky

### Estrutura de Pastas

```
├── app/[locale]/                 # Páginas com roteamento i18n
│   ├── page.tsx                 # Home
│   ├── empresa/[cnpj]/page.tsx  # Detalhes da empresa
│   ├── historico/page.tsx       # Histórico de buscas
│   ├── comparar/page.tsx        # Comparação de empresas
│   ├── api-docs/page.tsx        # Documentação da API
│   └── sobre/page.tsx           # Sobre o projeto
├── components/                   # Componentes React
│   ├── ui/                      # Componentes shadcn/ui
│   ├── CompanyHeader.tsx        # Cabeçalho da empresa
│   ├── CompanyBasicInfo.tsx     # Informações básicas
│   ├── CompanyAddress.tsx       # Endereço da empresa
│   ├── CompanyPartners.tsx      # Sócios e participações
│   ├── CompanyCNAE.tsx         # Atividades econômicas
│   ├── Navigation.tsx          # Navegação principal
│   └── ThemeToggle.tsx         # Alternador de tema
├── lib/                         # Utilitários e configurações
│   ├── api.ts                  # Cliente da API
│   ├── cnpj.ts                 # Validação e formatação
│   ├── db/index.ts             # IndexedDB wrapper
│   ├── storage/index.ts        # LocalStorage helpers
│   └── exports/                # Funções de exportação
├── public/
│   ├── locales/                # Traduções i18n
│   ├── manifest.json           # PWA manifest
│   ├── cnpjfy-logo.svg         # Logo principal
│   ├── cnpjfy-icon.svg         # Ícone/favicon
│   └── icons/                  # Ícones PWA
└── middleware.ts               # Redirecionamento i18n
```

## 🧪 Testes

### Executar testes

```bash
# Testes unitários
npm test

# Testes e2e
npm run test:e2e

# Build de produção
npm run build
```

### Cobertura

- **Unitários:** Validação CNPJ, formatadores, componentes principais
- **E2E:** Fluxo completo (buscar → visualizar → favoritar → exportar)
- **Componentes:** Testes de renderização e interação

## 🚀 Deploy

### Build de produção

```bash
npm run build
npm start
```

### Plataformas recomendadas

- **Vercel** (recomendado para Next.js)
- **Netlify**
- **Railway**
- **Render**

## 🤝 Contribuindo

### Desenvolvimento

1. **Fork** o repositório
2. **Crie uma branch:** `git checkout -b feature/nova-funcionalidade`
3. **Commit suas mudanças:** `git commit -m 'feat: adiciona nova funcionalidade'`
4. **Push para a branch:** `git push origin feature/nova-funcionalidade`
5. **Abra um Pull Request**

### Padrões de Código

- **Commits:** Conventional Commits (feat, fix, docs, etc.)
- **Código:** ESLint + Prettier (configuração automática)
- **Testes:** Obrigatórios para novas funcionalidades
- **Acessibilidade:** Seguir diretrizes WCAG 2.1

## 📋 Roadmap

### Próximas funcionalidades

- [ ] **Gráficos interativos** para visualização de dados
- [ ] **Mapas interativos** com localização das empresas
- [ ] **Notificações push** para atualizações de empresas favoritas
- [ ] **Comparação avançada** com métricas calculadas
- [ ] **Modo offline completo** com sincronização
- [ ] **Relatórios personalizados** em PDF
- [ ] **Integração com redes sociais** para compartilhamento

### Melhorias técnicas

- [ ] **Server-side rendering** para SEO
- [ ] **Edge caching** com CDN
- [ ] **Monitoramento** de performance
- [ ] **Analytics** de uso
- [ ] **Testes de performance** automatizados

## 🎨 Design System

O projeto utiliza um design system consistente baseado em:

- **Cores:** Paleta moderna com suporte a tema escuro/claro
- **Tipografia:** Inter como fonte principal
- **Componentes:** shadcn/ui para consistência
- **Ícones:** Lucide React para ícones vetoriais
- **Animações:** Transições suaves e micro-interações

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT**. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Créditos

- **Dados:** Receita Federal do Brasil via API OpenCNPJ
- **Ícones:** Lucide
- **UI:** shadcn/ui
- **Fontes:** Google Fonts (Inter)

## 📞 Suporte

- **GitHub Issues:** [Reportar problemas](https://github.com/WalissonVinicius/cnpjfy/issues)
- **Discussões:** [GitHub Discussions](https://github.com/WalissonVinicius/cnpjfy/discussions)

---

<div align="center">

**[🏠 CNPJfy](https://www.cnpjfy.walisson.dev)** • **[📚 Documentação](#-funcionalidades)** • **[🐛 Issues](https://github.com/WalissonVinicius/cnpjfy/issues)**

Desenvolvido com ❤️ para a comunidade brasileira

</div>
