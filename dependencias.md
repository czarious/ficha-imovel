# dependencias.md
> Mapa de relacionamentos do projeto Zillow BR.
> Atualizar sempre que adicionar, remover ou renomear um arquivo ou dependência.

---

## 1. Páginas HTML → scripts e estilos carregados

### Portal

| Página | CSS | JS (em ordem) |
|--------|-----|---------------|
| `index.html` | `p-style.css` `g-global.css` | `p-config.js` → `p-storage.js` → `p-parser.js` → `p-ui.js` → `p-cards.js` → `p-filtros.js` → `p-versao.js` → `g-menu.js` |
| `p-imovel.html` | `p-style.css` `g-global.css` | `p-config.js` → `p-storage.js` → `p-parser.js` → `p-ui.js` → `p-render.js` → `p-versao.js` → `g-menu.js` |
| `cadastro.html` | `p-style.css` `g-global.css` | `p-config.js` → `p-storage.js` → `p-parser.js` → `p-ui.js` → `p-versao.js` → `g-menu.js` |
| `p-changelog.html` | CSS inline | `p-versao.js` _(sem g-menu.js — header próprio)_ |

### Ficha

| Página | CSS | JS (em ordem) |
|--------|-----|---------------|
| `f-ficha.html` | `g-global.css` + CSS inline | `f-versao.js` → SheetJS CDN → lógica inline → `g-menu.js` |
| `f-changelog.html` | CSS inline | `f-versao.js` _(sem g-menu.js — header próprio)_ |

> **CDN carregado em todas as páginas do portal:** SheetJS 0.18.5, Google Identity Services  
> **CDN externo usado só na ficha:** ViaCEP (fetch inline), Google Fonts (todas as páginas)

---

## 2. Módulos JS → o que expõem e de quem dependem

| Módulo | Expõe (globals / funções públicas) | Depende de |
|--------|------------------------------------|------------|
| `p-config.js` | `APP_NOME` `DRIVE_PASTA_ID` `DRIVE_API_KEY` `OAUTH_CLIENT_ID` `OAUTH_ESCOPOS` `EXCEL_PREFIXO` `EXCEL_EXTENSOES` `APP_MENSAGEM_ERRO_IMPORT` | — |
| `p-storage.js` | `inicializarOAuth()` `solicitarToken()` `saveImovel()` `checkDuplicata()` `normalizarId()` | `p-config.js` (constantes Drive/OAuth) |
| `p-parser.js` | `parsearExcel()` `montarObjetoImovel()` `validarArquivo()` | `p-config.js` (prefixo/extensões Excel) |
| `p-ui.js` | `mostrarToast()` `abrirModalDuplicata()` `fecharModal()` `formatarData()` `formatarEndereco()` `obterParam()` `renderizarBotaoLogin()` `atualizarEstadoLogin()` | — |
| `p-filtros.js` | `inicializarFiltros()` `aplicarFiltros()` `limparTodosFiltros()` — define `_todosImoveis` | `p-cards.js` → `renderizarCards()` |
| `p-cards.js` | `renderizarCards()` `criarCard()` `navegarParaImovel()` | `p-ui.js` → `formatarData()` `formatarEndereco()` · lê `_todosImoveis` de `p-filtros.js` |
| `p-render.js` | `renderizarFicha()` | `p-ui.js` → `formatarData()` `formatarEndereco()` |
| `p-versao.js` | `VERSAO_PORTAL` `CHANGELOG_PORTAL` `abrirChangelogPortal()` | — |
| `f-versao.js` | `VERSAO_ATUAL` `CHANGELOG` `abrirChangelog()` | — |
| `g-menu.js` | injeta `<aside id="sidebar">` via IIFE | lê `VERSAO_PORTAL` e `MENU_BASE` (globals declarados na página) |

---

## 3. Globals — quem define, quem usa

| Global | Definido em | Usado em |
|--------|-------------|----------|
| `VERSAO_PORTAL` | `p-versao.js` | `g-menu.js` (badge de versão na sidebar) |
| `VERSAO_ATUAL` | `f-versao.js` | `f-changelog.html` (inline) · `f-ficha.html` (bridge¹) |
| `CHANGELOG_PORTAL` | `p-versao.js` | `p-changelog.html` (inline) |
| `CHANGELOG` | `f-versao.js` | `f-changelog.html` (inline) |
| `MENU_BASE` | inline em cada HTML (`'./'`) | `g-menu.js` |
| `_todosImoveis` | `p-filtros.js` | `p-cards.js` · `p-filtros.js` |
| `APP_NOME` | `p-config.js` | `p-storage.js` · `p-parser.js` |
| `DRIVE_PASTA_ID` | `p-config.js` | `p-storage.js` |
| `DRIVE_API_KEY` | `p-config.js` | `p-storage.js` |
| `OAUTH_CLIENT_ID` | `p-config.js` | `p-storage.js` |
| `OAUTH_ESCOPOS` | `p-config.js` | `p-storage.js` |
| `EXCEL_PREFIXO` | `p-config.js` | `p-parser.js` |
| `EXCEL_EXTENSOES` | `p-config.js` | `p-parser.js` |
| `dom` | `f-ficha.html` (inline, via fetch de `f-dominios.json`) | `f-ficha.html` (inline) |

> ¹ Bridge em `f-ficha.html`: `const VERSAO_PORTAL = typeof VERSAO_ATUAL !== 'undefined' ? VERSAO_ATUAL : '—';`  
> Removido após Fase 4 (g-versao.js define ambos).

---

## 4. Dados externos

| Fonte | Acessado por | Como |
|-------|-------------|------|
| `dominios/f-dominios.json` | `f-ficha.html` (inline) | `fetch()` — URL raw do GitHub em produção |
| Google Drive API v3 | `p-storage.js` | REST via `fetch()` com token OAuth |
| ViaCEP | `f-ficha.html` (inline) | `fetch('https://viacep.com.br/ws/{cep}/json/')` |
| Google Identity Services | `p-storage.js` (via CDN) | `google.accounts.oauth2.initTokenClient()` |

---

## 5. Pendências estruturais (impactam este arquivo)

| Fase | O que muda |
|------|-----------|
| **Fase 4** _(pendente)_ | `f-versao.js` + `p-versao.js` → `js/g-versao.js` · atualizar 6 HTMLs |
| **Fase 5** _(pendente)_ | `p-config.js` → `js/g-config.js` · atualizar 3 HTMLs |
