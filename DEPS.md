# DEPS.md — Mapa de dependências do Zillow BR
> Atualizar sempre que adicionar, remover ou renomear arquivo, link ou dependência.  
> Auditado em: 10/Jun/2026 · versão portal 0.7.1 / ficha 0.7.3

---

## 1. Páginas HTML → CSS e scripts carregados

### Portal

| Página | CSS | Scripts (em ordem de carga) |
|--------|-----|-----------------------------|
| `index.html` | `css/p-style.css` `css/g-global.css` | `js/g-config.js` → `js/p-storage.js` → `js/p-parser.js` → `js/p-ui.js` → `js/p-cards.js` → `js/p-filtros.js` → `js/p-import.js` → `js/g-versao.js` → `js/g-menu.js` |
| `p-imovel.html` | `css/p-style.css` `css/g-global.css` + Leaflet CSS (CDN) | `js/g-config.js` → `js/p-storage.js` → `js/p-parser.js` → `js/p-ui.js` → `js/p-render.js` → `js/g-geo.js` → `js/p-mapa.js` → `js/p-acoes.js` → `js/g-versao.js` → `js/g-menu.js` |
| `cadastro.html` | `css/p-style.css` `css/g-global.css` | `js/g-config.js` → `js/p-storage.js` → `js/p-parser.js` → `js/p-ui.js` → `js/p-import.js` → `js/g-versao.js` → `js/g-menu.js` |
| `g-changelog.html` | CSS inline | `js/g-config.js` → `js/g-versao.js` — **sem g-menu.js** (header próprio); changelog unificado em accordion; nome via `APP_NOME` |

### Ficha

| Página | CSS | Scripts (em ordem de carga) |
|--------|-----|-----------------------------|
| `f-ficha.html` | `css/g-global.css` + CSS inline | `js/g-config.js` → `js/g-versao.js` → SheetJS CDN → `js/g-geo.js` → lógica inline → `js/g-menu.js` |

> `g-changelog.html` é compartilhado (Ficha + Portal) — listado na seção Portal acima.

> **CDN em todas as páginas do portal:** SheetJS 0.18.5 · Google Identity Services  
> **CDN só em `p-imovel.html`:** Leaflet 1.9.4 + tiles OpenStreetMap (mapa)  
> **CDN só na ficha:** Google Fonts (p-style.css já importa para o portal)

---

## 2. Navegação entre páginas

| De | Para | Como |
|----|------|------|
| `index.html` | `p-imovel.html?id=X` | `p-cards.js` → `window.location.href` |
| `p-imovel.html` | `index.html` | link estático na barra de ações |
| `cadastro.html` | `f-ficha.html` | link estático no botão CTA |
| `cadastro.html` | `index.html` | `window.location.href` após importação bem-sucedida |
| `g-changelog.html` | página de origem | botão "← Voltar" → `history.back()` (fallback `index.html`) |
| `g-menu.js` | `index.html` | link sidebar (Home) |
| `g-menu.js` | `cadastro.html` | link sidebar (Cadastro de Imóvel) |
| `g-menu.js` | `g-changelog.html` | botão de versão na sidebar |
| `g-versao.js` | `g-changelog.html` | `abrirChangelog()` e `abrirChangelogPortal()` → `window.location.href` |

---

## 3. Módulos JS → o que expõem e de quem dependem

| Módulo | Expõe | Depende de |
|--------|-------|------------|
| `g-config.js` | `APP_NOME` `TOAST_KEY` `DRIVE_PASTA_ID` `DRIVE_API_KEY` `OAUTH_CLIENT_ID` `OAUTH_ESCOPOS` `EXCEL_PREFIXO` `EXCEL_EXTENSOES` `APP_MENSAGEM_ERRO_IMPORT` | — |
| `p-storage.js` | `inicializarOAuth()` `solicitarToken()` `getImoveis()` `getImovelById()` `saveImovel()` `deleteImovel()` `checkDuplicata()` `normalizarId()` | `g-config.js` |
| `p-parser.js` | `parsearExcel()` `montarObjetoImovel()` `validarArquivo()` | `g-config.js` |
| `p-ui.js` | `mostrarToast()` `mostrarToastPendente()` `abrirModalDuplicata()` `fecharModal()` `formatarData()` `formatarEndereco()` `obterParam()` `renderizarBotaoLogin()` `atualizarEstadoLogin()` | — |
| `p-filtros.js` | `inicializarFiltros()` `aplicarFiltros()` `limparTodosFiltros()` · define `_todosImoveis` | chama `renderizarCards()` de `p-cards.js` |
| `p-cards.js` | `renderizarCards()` `criarCard()` `navegarParaImovel()` | `p-ui.js` → `formatarData()` `formatarEndereco()` · lê `_todosImoveis` de `p-filtros.js` |
| `p-render.js` | `renderizarFicha()` | `p-ui.js` → `formatarData()` `formatarEndereco()` |
| `g-versao.js` | `VERSAO_PORTAL` `VERSAO_ATUAL` `CHANGELOG_PORTAL` `CHANGELOG` `CHANGELOG_GERAL` `abrirChangelogPortal()` `abrirChangelog()` | — |
| `g-menu.js` | injeta `<aside id="sidebar">` via IIFE | lê `VERSAO_PORTAL` e `MENU_BASE` (globals da página) |
| `g-geo.js` | `geocodificarEndereco(endereco)` → `{lat,lng}` ou `null` | — · usado por `f-ficha.html` (cadastro) e `p-imovel.html` (fallback) |
| `p-mapa.js` | `renderizarMapa(...)` + `montarMapa(imovel)` (orquestra: lê coord salva → fallback geocode → desenha) | Leaflet (CDN) · `g-geo.js` · `formatarEndereco()` de `p-ui.js` · usado por `p-imovel.html` |
| `p-import.js` | `acionarImportacao()` + `processarArquivo(evento)` (parse → valida → duplicata → salva) | `p-parser.js` · `p-storage.js` · `p-ui.js` · chama hook `aoImportarComSucesso()` da página · usado por `index.html` e `cadastro.html` |
| `p-acoes.js` | `copiarLink()` `renderizarBotaoWhatsApp(imovel)` `configurarBotaoExcluir(imovel)` | `mostrarToast()` [p-ui.js] · `deleteImovel()` [p-storage.js] · usado por `p-imovel.html` |

---

## 4. Variáveis globais — quem define, quem usa

| Global | Definido em | Usado em |
|--------|-------------|----------|
| `VERSAO_PORTAL` | `g-versao.js` | `g-menu.js` (badge) · `g-changelog.html` (badge + versão atual) |
| `VERSAO_ATUAL` | `g-versao.js` | alinhado a `VERSAO_PORTAL` (ambos 0.7.1) |
| `CHANGELOG_PORTAL` | `g-versao.js` | `g-changelog.html` (entradas Portal ≤ 0.7.0) |
| `CHANGELOG` | `g-versao.js` | `g-changelog.html` (entradas Ficha ≤ 0.7.0) |
| `CHANGELOG_GERAL` | `g-versao.js` | `g-changelog.html` (entradas unificadas ≥ 0.7.1) |
| `MENU_BASE` | inline em cada HTML — sempre `'./'` | `g-menu.js` |
| `_todosImoveis` | `p-filtros.js` | `p-cards.js` · `p-filtros.js` |
| `TOAST_KEY` | `g-config.js` | `p-ui.js` (mostrarToastPendente) · `p-acoes.js` (excluir) · `cadastro.html` (redirect após importação) |
| `APP_NOME` | `g-config.js` | **nome do site (fonte única)**: `g-menu.js` (logo) · `p-acoes.js` (msg WhatsApp) · `p-render.js`/`index.html`/`cadastro.html`/`g-changelog.html` (títulos) · base de `APP_MENSAGEM_ERRO_IMPORT` |
| `DRIVE_PASTA_ID` | `g-config.js` | `p-storage.js` |
| `DRIVE_API_KEY` | `g-config.js` | `p-storage.js` |
| `OAUTH_CLIENT_ID` | `g-config.js` | `p-storage.js` |
| `OAUTH_ESCOPOS` | `g-config.js` | `p-storage.js` |
| `EXCEL_PREFIXO` | `g-config.js` | `p-parser.js` |
| `EXCEL_EXTENSOES` | `g-config.js` | `p-parser.js` |
| `dom` | `f-ficha.html` (inline, via fetch) | `f-ficha.html` (inline) |
| `aoImportarComSucesso` | inline em `index.html` e `cadastro.html` | `p-import.js` (hook ao concluir importação) |


---

## 5. Dados externos e arquivos de dados

| Recurso | Acessado por | Caminho / URL |
|---------|-------------|---------------|
| `dominios/f-dominios.json` | `f-ficha.html` (inline) | **URL relativa** `'dominios/f-dominios.json'` — funciona no Live Server e no GitHub Pages |
| Google Drive API v3 | `p-storage.js` | REST via `fetch()` com token OAuth |
| ViaCEP | `f-ficha.html` (inline) | `fetch('https://viacep.com.br/ws/{cep}/json/')` |
| Nominatim / OpenStreetMap | `g-geo.js` | `fetch('https://nominatim.openstreetmap.org/search?...')` — geocodificação |
| Tiles OpenStreetMap | `p-mapa.js` (via Leaflet) | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` |
| Google Identity Services | `p-storage.js` via CDN | `google.accounts.oauth2.initTokenClient()` |

> ⚠️ Nunca trocar `dominios/f-dominios.json` por URL raw do GitHub — causa 404 no Live Server antes do push.

---

