# DEPS.md — Mapa técnico de dependências do Zillow BR

> **Finalidade:** referência técnica de lookup — versões, dependências, ordem de carga, API dos módulos e variáveis globais.  
> Contém o **como** e o **onde**. Consultado durante o trabalho quando precisar de detalhes precisos.  
> Contexto do projeto, decisões de arquitetura e regras de trabalho ficam em **CLAUDE.md** — não duplicar aqui.

> Atualizar sempre que adicionar, remover ou renomear arquivo, link ou dependência.  
> Auditado em: 18/Jun/2026 · versão portal 0.7.7 / ficha 0.7.7

---

## 0. Versões por arquivo

> Leia esta seção no início de cada sessão para saber o estado real de cada arquivo.  
> A versão do arquivo reflete **quando ele foi tocado pela última vez** — não a versão do produto.  
> Sempre que um arquivo for editado: bumpar seu cabeçalho + atualizar esta tabela + atualizar `CHANGELOG_GERAL` em `g-versao.js`.

| Arquivo | Versão atual | Última mudança relevante |
|---------|-------------|--------------------------|
| `f-ficha.html` | 0.7.7 | Seção Edificações (Chácara/Sítio/Fazenda/Galpão/Prédio Comercial) + tooltips em 13 campos |
| `js/g-versao.js` | 0.7.7 | `VERSAO_PORTAL=0.7.7` / `VERSAO_ATUAL=0.7.7`; changelog v0.7.7 (Edificações + tooltips) |
| `js/g-definicoes.js` | 0.7.7 | Fonte única de 13 definições de termos imobiliários; expõe `DEFINICOES` e `getDefPorLabel()` |
| `js/g-menu.js` | 0.7.2 | Badge de versão detecta ficha vs portal pelo pathname |
| `js/g-config.js` | 0.7.1 | Constantes globais do app (APP_NOME, TOAST_KEY, Drive IDs) |
| `js/g-geo.js` | 0.7.1 | Geocodificação via Nominatim |
| `js/p-render.js` | 0.7.7 | renderEdificacoes() + tooltips via getDefPorLabel() + renderAtributo() formata R$ |
| `js/p-mapa.js` | 0.7.2 | invalidateSize() — mapa renderiza completo ao abrir |
| `js/p-storage.js` | 0.7.1 | CRUD no Google Drive (list, upload, download, delete) |
| `js/p-parser.js` | 0.7.7 | Suporte a marcador `[Edificação]`; popula `imovel.edificacoes[]`; fallback para `imovel.comodos` |
| `js/p-ui.js` | 0.7.1 | Toasts, modais, helpers compartilhados |
| `js/p-filtros.js` | 0.7.6 | Filtro de Modalidade; tipoImovel lê de grupos['Informações Técnicas'] |
| `js/p-cards.js` | 0.7.6 | Preço + badge Venda/Locação nos cards; tipoImovel com fallback correto |
| `js/p-import.js` | 0.7.1 | Pipeline completo de importação (parse→valida→duplicata→salva) |
| `js/p-acoes.js` | 0.7.1 | Copiar link, WhatsApp, excluir imóvel |
| `css/g-global.css` | 0.7.1 | Sidebar CSS + tokens globais |
| `css/p-style.css` | 0.7.7 | Estilos edificações no portal + `.campo-tip` tooltips |
| `index.html` | 0.7.7 | Select filtro-modalidade (Venda / Locação) |
| `p-imovel.html` | 0.7.7 | Carrega `js/g-definicoes.js`; flag DADOS_TESTE (modo de teste local) |
| `cadastro.html` | 0.7.1 | Tutorial + importação |
| `g-changelog.html` | 0.7.1 | Changelog unificado (accordion) |
| `dominios/f-dominios.json` | 0.7.2 | tipos_ambiente com Banheiro, Cozinha, Área de Serviço |

---

## 1. Páginas HTML → CSS e scripts carregados

### Portal

| Página | CSS | Scripts (em ordem de carga) |
|--------|-----|-----------------------------|
| `index.html` | `css/p-style.css` `css/g-global.css` | `js/g-config.js` → `js/p-storage.js` → `js/p-parser.js` → `js/p-ui.js` → `js/p-cards.js` → `js/p-filtros.js` → `js/p-import.js` → `js/g-versao.js` → `js/g-menu.js` |
| `p-imovel.html` | `css/p-style.css` `css/g-global.css` + Leaflet CSS (CDN) | `js/g-config.js` → `js/g-definicoes.js` → `js/p-storage.js` → `js/p-parser.js` → `js/p-ui.js` → `js/p-render.js` → `js/g-geo.js` → `js/p-mapa.js` → `js/p-acoes.js` → `js/g-versao.js` → `js/g-menu.js` |
| `cadastro.html` | `css/p-style.css` `css/g-global.css` | `js/g-config.js` → `js/p-storage.js` → `js/p-parser.js` → `js/p-ui.js` → `js/p-import.js` → `js/g-versao.js` → `js/g-menu.js` |
| `g-changelog.html` | CSS inline | `js/g-config.js` → `js/g-versao.js` — **sem g-menu.js** (header próprio); changelog unificado em accordion; nome via `APP_NOME` |

### Ficha

| Página | CSS | Scripts (em ordem de carga) |
|--------|-----|-----------------------------|
| `f-ficha.html` | `css/g-global.css` + CSS inline | `js/g-config.js` → `js/g-definicoes.js` → `js/g-versao.js` → SheetJS CDN → `js/g-geo.js` → lógica inline → `js/g-menu.js` |

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
| `g-definicoes.js` | `DEFINICOES` (objeto com 13 termos imobiliários) · `getDefPorLabel(label)` → entrada ou null | — · usado por `f-ficha.html` (tooltipInit via data-def) e `p-render.js` (renderAtributo via getDefPorLabel) |
| `p-storage.js` | `inicializarOAuth()` `solicitarToken()` `getImoveis()` `getImovelById()` `saveImovel()` `deleteImovel()` `checkDuplicata()` `normalizarId()` | `g-config.js` |
| `p-parser.js` | `parsearExcel()` `montarObjetoImovel()` `validarArquivo()` | `g-config.js` |
| `p-ui.js` | `mostrarToast()` `mostrarToastPendente()` `abrirModalDuplicata()` `fecharModal()` `formatarData()` `formatarEndereco()` `obterParam()` `renderizarBotaoLogin()` `atualizarEstadoLogin()` | — |
| `p-filtros.js` | `inicializarFiltros()` `aplicarFiltros()` `limparTodosFiltros()` · define `_todosImoveis` | chama `renderizarCards()` de `p-cards.js` |
| `p-cards.js` | `renderizarCards()` `criarCard()` `navegarParaImovel()` | `p-ui.js` → `formatarData()` `formatarEndereco()` · lê `_todosImoveis` de `p-filtros.js` |
| `p-render.js` | `renderizarFicha()` | `p-ui.js` → `formatarData()` `formatarEndereco()` |
| `g-versao.js` | `VERSAO_PORTAL` `VERSAO_ATUAL` `CHANGELOG_PORTAL` `CHANGELOG` `CHANGELOG_GERAL` `abrirChangelogPortal()` `abrirChangelog()` | — |
| `g-menu.js` | injeta `<aside id="sidebar">` via IIFE | lê `VERSAO_PORTAL` / `VERSAO_ATUAL` (detecta ficha por pathname) e `MENU_BASE` (globals da página) |
| `g-geo.js` | `geocodificarEndereco(endereco)` → `{lat,lng}` ou `null` | — · usado por `f-ficha.html` (cadastro) e `p-imovel.html` (fallback) |
| `p-mapa.js` | `renderizarMapa(...)` + `montarMapa(imovel)` (orquestra: lê coord salva → fallback geocode → desenha) | Leaflet (CDN) · `g-geo.js` · `formatarEndereco()` de `p-ui.js` · usado por `p-imovel.html` |
| `p-import.js` | `acionarImportacao()` + `processarArquivo(evento)` (parse → valida → duplicata → salva) | `p-parser.js` · `p-storage.js` · `p-ui.js` · chama hook `aoImportarComSucesso()` da página · usado por `index.html` e `cadastro.html` |
| `p-acoes.js` | `copiarLink()` `renderizarBotaoWhatsApp(imovel)` `configurarBotaoExcluir(imovel)` | `mostrarToast()` [p-ui.js] · `deleteImovel()` [p-storage.js] · usado por `p-imovel.html` |

---

## 4. Variáveis globais — quem define, quem usa

| Global | Definido em | Usado em |
|--------|-------------|----------|
| `DEFINICOES` | `g-definicoes.js` | `f-ficha.html` (tooltipInit — lê via data-def) · `p-render.js` (renderAtributo — via getDefPorLabel) |
| `getDefPorLabel` | `g-definicoes.js` | `p-render.js` (renderAtributo) |
| `VERSAO_PORTAL` | `g-versao.js` | `g-menu.js` (badge) · `g-changelog.html` (badge + versão atual) |
| `VERSAO_ATUAL` | `g-versao.js` | `g-menu.js` — badge de versão quando em `f-ficha.html` (0.7.4) |
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

## 6. Modo de teste local (DADOS_TESTE)

> **Por que existe:** a Drive API tem quota diária. Cada carregamento do portal consome chamadas.
> Durante desenvolvimento, `DADOS_TESTE = true` desvia tudo para um JSON local — sem Drive, sem OAuth, sem quota.
> Criado em: 15/Jun/2026. Arquivos alterados: `index.html`, `p-imovel.html` (2 trechos cada).
> Arquivos criados: `dados/config-teste.js`, `dados/imoveis-teste.json`.

---

### Pasta e arquivos criados

```
dados/                     ← pasta criada exclusivamente para o modo de teste
  config-teste.js          ← ÚNICO ponto de controle do modo (true/false)
  imoveis-teste.json       ← dados fictícios: 1 apartamento completo, Ribeirão Preto/SP
```

**`dados/config-teste.js` — conteúdo completo atual:**
```javascript
/* arquivo: dados/config-teste.js
   MODO DE TESTE — troque true/false para ligar/desligar
   true  → carrega dados/imoveis-teste.json (sem Drive API, sem OAuth)
   false → carrega do Google Drive normalmente
   Alterar APENAS aqui — index.html e p-imovel.html leem esta variável. */
const DADOS_TESTE = true;
```

> ⚠️ Mudar `DADOS_TESTE` aqui afeta os dois HTMLs ao mesmo tempo. Nunca editar o flag diretamente nos HTMLs.

---

### `index.html` — o que foi alterado

#### Alteração 1 — 2 linhas inseridas no `<head>`, logo após `<meta name="description">`

**Inserido (apagar para reverter):**
```html

  <!-- MODO DE TESTE — editar dados/config-teste.js para ligar/desligar -->
  <script src="dados/config-teste.js"></script>
```

---

#### Alteração 2 — bloco Google Identity Services substituído no `<head>`, após SheetJS

**Estado atual (teste) — apagar e substituir:**
```html
  <!-- Google Identity Services — carrega só se não estiver em modo de teste -->
  <script>
    if (!DADOS_TESTE) {
      const _gsi = document.createElement('script');
      _gsi.src   = 'https://accounts.google.com/gsi/client';
      _gsi.onload = () => inicializarOAuth();
      _gsi.async  = true;
      _gsi.defer  = true;
      document.head.appendChild(_gsi);
    }
  </script>
```

**Repor o original:**
```html
  <!-- Google Identity Services — OAuth 2.0 -->
  <script src="https://accounts.google.com/gsi/client" onload="inicializarOAuth()" async defer></script>
```

---

#### Alteração 3 — carregamento de imóveis no `DOMContentLoaded` (inline script, final do `<body>`)

**Estado atual (teste) — apagar e substituir:**
```javascript
        const imoveis = DADOS_TESTE
          ? await fetch('dados/imoveis-teste.json').then(r => r.json())
          : await getImoveis();
```

**Repor o original:**
```javascript
        const imoveis = await getImoveis();
```

---

### `p-imovel.html` — o que foi alterado

#### Alteração 1 — 2 linhas inseridas no `<head>`, logo após `<meta name="description">`

**Inserido (apagar para reverter):**
```html
  <!-- MODO DE TESTE — editar dados/config-teste.js para ligar/desligar -->
  <script src="dados/config-teste.js"></script>
```

---

#### Alteração 2 — bloco Google Identity Services substituído no `<head>`, após SheetJS

Idêntico à Alteração 2 do `index.html`.

**Repor o original:**
```html
  <!-- Google Identity Services — OAuth 2.0 -->
  <script src="https://accounts.google.com/gsi/client" onload="inicializarOAuth()" async defer></script>
```

---

#### Alteração 3 — busca do imóvel no `DOMContentLoaded` (inline script, final do `<body>`)

**Estado atual (teste) — apagar e substituir:**
```javascript
        let imovel;
        if (DADOS_TESTE) {
          const lista = await fetch('dados/imoveis-teste.json').then(r => r.json());
          imovel = lista.find(i => i.id === _idImovel) || null;
        } else {
          imovel = await getImovelById(_idImovel);
        }
```

**Repor o original:**
```javascript
        const imovel = await getImovelById(_idImovel);
```

---

### Checklist de reversão completo

Execute cada item. Ao final, o código deve estar idêntico ao estado anterior ao modo de teste.

- [ ] Deletar o arquivo `dados/config-teste.js`
- [ ] Deletar o arquivo `dados/imoveis-teste.json`
- [ ] Deletar a pasta `dados/` (só se estiver vazia — verificar antes)
- [ ] `index.html` — Alteração 1: remover as 2 linhas do config-teste (comentário + script src)
- [ ] `index.html` — Alteração 2: substituir o bloco GSI condicional pelo script estático original
- [ ] `index.html` — Alteração 3: substituir o fetch condicional por `const imoveis = await getImoveis();`
- [ ] `p-imovel.html` — Alteração 1: remover as 2 linhas do config-teste (comentário + script src)
- [ ] `p-imovel.html` — Alteração 2: substituir o bloco GSI condicional pelo script estático original
- [ ] `p-imovel.html` — Alteração 3: substituir o bloco if/else por `const imovel = await getImovelById(_idImovel);`

---

## 7. Design Tokens e breakpoints

```css
--verde-escuro: #2B5F3E   /* primary accent */
--areia:        #F5F3EE   /* background */
--texto:        #1a1a1a
--cinza-claro:  #e0ddd8
```

Breakpoint responsivo: `600px` (mobile — sidebar e layout colapsam).

---
