# DEPS.md — Mapa de dependências do Zillow BR
> Atualizar sempre que adicionar, remover ou renomear arquivo, link ou dependência.  
> Auditado em: 05/Jun/2026 · versão portal 0.6.1 / ficha 0.6.2

---

## 1. Páginas HTML → CSS e scripts carregados

### Portal

| Página | CSS | Scripts (em ordem de carga) |
|--------|-----|-----------------------------|
| `index.html` | `css/p-style.css` `css/g-global.css` | `js/g-config.js` → `js/p-storage.js` → `js/p-parser.js` → `js/p-ui.js` → `js/p-cards.js` → `js/p-filtros.js` → `js/g-versao.js` → `js/g-menu.js` |
| `p-imovel.html` | `css/p-style.css` `css/g-global.css` | `js/g-config.js` → `js/p-storage.js` → `js/p-parser.js` → `js/p-ui.js` → `js/p-render.js` → `js/g-versao.js` → `js/g-menu.js` |
| `cadastro.html` | `css/p-style.css` `css/g-global.css` | `js/g-config.js` → `js/p-storage.js` → `js/p-parser.js` → `js/p-ui.js` → `js/g-versao.js` → `js/g-menu.js` |
| `p-changelog.html` | CSS inline | `js/g-versao.js` — **sem g-menu.js** (header próprio) |

### Ficha

| Página | CSS | Scripts (em ordem de carga) |
|--------|-----|-----------------------------|
| `f-ficha.html` | `css/g-global.css` + CSS inline | `js/g-versao.js` → SheetJS CDN → lógica inline → `js/g-menu.js` |
| `f-changelog.html` | CSS inline | `js/g-versao.js` — **sem g-menu.js** (header próprio) |

> **CDN em todas as páginas do portal:** SheetJS 0.18.5 · Google Identity Services  
> **CDN só na ficha:** Google Fonts (p-style.css já importa para o portal)

---

## 2. Navegação entre páginas

| De | Para | Como |
|----|------|------|
| `index.html` | `p-imovel.html?id=X` | `p-cards.js` → `window.location.href` |
| `p-imovel.html` | `index.html` | link estático na barra de ações |
| `cadastro.html` | `f-ficha.html` | link estático no botão CTA |
| `cadastro.html` | `index.html` | `window.location.href` após importação bem-sucedida |
| `p-changelog.html` | `index.html` | link "← Voltar ao Portal" |
| `p-changelog.html` | `f-changelog.html` | link no rodapé |
| `f-changelog.html` | `f-ficha.html` | link "← Voltar à Ficha" |
| `f-changelog.html` | `p-changelog.html` | link no rodapé |
| `g-menu.js` | `index.html` | link sidebar (Home) |
| `g-menu.js` | `cadastro.html` | link sidebar (Cadastro de Imóvel) |
| `g-menu.js` | `p-changelog.html` | botão de versão na sidebar |
| `p-versao.js` | `p-changelog.html` | `abrirChangelogPortal()` → `window.location.href` |
| `f-versao.js` | `f-changelog.html` | `abrirChangelog()` → `window.location.href` |

---

## 3. Módulos JS → o que expõem e de quem dependem

| Módulo | Expõe | Depende de |
|--------|-------|------------|
| `g-config.js` | `APP_NOME` `DRIVE_PASTA_ID` `DRIVE_API_KEY` `OAUTH_CLIENT_ID` `OAUTH_ESCOPOS` `EXCEL_PREFIXO` `EXCEL_EXTENSOES` `APP_MENSAGEM_ERRO_IMPORT` | — |
| `p-storage.js` | `inicializarOAuth()` `solicitarToken()` `saveImovel()` `checkDuplicata()` `normalizarId()` | `g-config.js` |
| `p-parser.js` | `parsearExcel()` `montarObjetoImovel()` `validarArquivo()` | `g-config.js` |
| `p-ui.js` | `mostrarToast()` `abrirModalDuplicata()` `fecharModal()` `formatarData()` `formatarEndereco()` `obterParam()` `renderizarBotaoLogin()` `atualizarEstadoLogin()` | — |
| `p-filtros.js` | `inicializarFiltros()` `aplicarFiltros()` `limparTodosFiltros()` · define `_todosImoveis` | chama `renderizarCards()` de `p-cards.js` |
| `p-cards.js` | `renderizarCards()` `criarCard()` `navegarParaImovel()` | `p-ui.js` → `formatarData()` `formatarEndereco()` · lê `_todosImoveis` de `p-filtros.js` |
| `p-render.js` | `renderizarFicha()` | `p-ui.js` → `formatarData()` `formatarEndereco()` |
| `g-versao.js` | `VERSAO_PORTAL` `VERSAO_ATUAL` `CHANGELOG_PORTAL` `CHANGELOG` `abrirChangelogPortal()` `abrirChangelog()` | — |
| `g-menu.js` | injeta `<aside id="sidebar">` via IIFE | lê `VERSAO_PORTAL` e `MENU_BASE` (globals da página) |

---

## 4. Variáveis globais — quem define, quem usa

| Global | Definido em | Usado em |
|--------|-------------|----------|
| `VERSAO_PORTAL` | `g-versao.js` | `g-menu.js` (badge na sidebar) |
| `VERSAO_ATUAL` | `g-versao.js` | `f-changelog.html` (inline) |
| `CHANGELOG_PORTAL` | `g-versao.js` | `p-changelog.html` (inline) |
| `CHANGELOG` | `g-versao.js` | `f-changelog.html` (inline) |
| `MENU_BASE` | inline em cada HTML — sempre `'./'` | `g-menu.js` |
| `_todosImoveis` | `p-filtros.js` | `p-cards.js` · `p-filtros.js` |
| `APP_NOME` | `g-config.js` | `p-storage.js` · `p-parser.js` |
| `DRIVE_PASTA_ID` | `g-config.js` | `p-storage.js` |
| `DRIVE_API_KEY` | `g-config.js` | `p-storage.js` |
| `OAUTH_CLIENT_ID` | `g-config.js` | `p-storage.js` |
| `OAUTH_ESCOPOS` | `g-config.js` | `p-storage.js` |
| `EXCEL_PREFIXO` | `g-config.js` | `p-parser.js` |
| `EXCEL_EXTENSOES` | `g-config.js` | `p-parser.js` |
| `dom` | `f-ficha.html` (inline, via fetch) | `f-ficha.html` (inline) |


---

## 5. Dados externos e arquivos de dados

| Recurso | Acessado por | Caminho / URL |
|---------|-------------|---------------|
| `dominios/f-dominios.json` | `f-ficha.html` (inline) | **URL relativa** `'dominios/f-dominios.json'` — funciona no Live Server e no GitHub Pages |
| Google Drive API v3 | `p-storage.js` | REST via `fetch()` com token OAuth |
| ViaCEP | `f-ficha.html` (inline) | `fetch('https://viacep.com.br/ws/{cep}/json/')` |
| Google Identity Services | `p-storage.js` via CDN | `google.accounts.oauth2.initTokenClient()` |

> ⚠️ Nunca trocar `dominios/f-dominios.json` por URL raw do GitHub — causa 404 no Live Server antes do push.

---

## 6. Fases pendentes que impactam este arquivo

| Fase | Arquivos afetados |
|------|------------------|
| ~~**Fase 4**~~ | ✓ concluída — `g-versao.js` substituiu `f-versao.js` + `p-versao.js` |
| ~~**Fase 5**~~ | ✓ concluída — `g-config.js` substituiu `p-config.js` |
