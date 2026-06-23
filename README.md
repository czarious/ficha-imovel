# Zillow BR — Ficha Técnica de Imóveis

Proptech imobiliária com ficha técnica profunda de imóveis.
Duas partes: **Ficha** (`f-ficha.html`) — formulário que exporta Excel — e **Portal** (`index.html`) — importa os Excel, armazena no Google Drive, exibe com filtros.

Sem build, sem package manager, sem framework. HTML + CSS + JS puro via CDN.

---

## 1. Pré-requisitos — o que instalar após formatar

| Software | Para que serve | Como obter |
|---|---|---|
| **Node.js** (LTS) | Base para o Claude Code CLI | https://nodejs.org |
| **Claude Code CLI** | Sessões de desenvolvimento assistido | `npm install -g @anthropic-ai/claude-code` |
| **VS Code** | Editor + servidor local | https://code.visualstudio.com |
| **Extensão Live Server** | Testar o site localmente sem build | VS Code → Extensions → `ritwick.dey.liveserver` |
| **GitHub Desktop** | Commits e push sem linha de comando | https://desktop.github.com |
| **Obsidian** | Backlog, histórico e decisões de arquitetura | https://obsidian.md (vault sincroniza via Google Drive) |

### Obsidian MCP — atenção na versão
Após instalar o Obsidian, instalar o servidor MCP na versão **fixada 2025.7.1**.
Versões mais novas quebram o parâmetro `roots` e o MCP para de funcionar.
Setup via `.bat` global — ver `reference_obsidian_mcp.md` na memória do Claude (`C:\Users\cesar\.claude\projects\...\memory\`).

---

## 2. Como rodar localmente

1. Clonar o repositório via GitHub Desktop
2. Abrir a pasta no VS Code
3. Clicar com botão direito em `f-ficha.html` ou `index.html` → **Open with Live Server**
4. O navegador abre em `http://127.0.0.1:5500/` — pronto para testar

> **Nunca abrir os arquivos HTML diretamente no navegador** (ex.: `file:///...`).
> Os `fetch()` locais (domínios, dados de teste) falham por política de CORS do browser.

---

## 3. Boas práticas antes de começar

- **Ler `CLAUDE.md` e `DEPS.md`** no início de cada sessão — contêm o estado atual do projeto, versões e decisões de arquitetura
- **Nunca editar `js/g-config.js`** sem instrução explícita — é a fonte única de credenciais e constantes do app
- **Nunca editar `dados/config-teste.js`** antes de commitar — `DADOS_TESTE = true` é o estado permanente de desenvolvimento; alterar antes do commit sobe o flag errado para produção
- **Não recarregar o portal online durante testes** — cada carregamento de `index.html` ou `p-imovel.html` consome quota da Drive API; usar sempre o Live Server local
- **Commit e push sempre pelo GitHub Desktop** — nunca automático; sempre revisar o diff antes

---

## 4. Estrutura rápida do projeto

```
raiz/
  f-ficha.html          ← formulário de coleta de dados (exporta Excel)
  index.html            ← portal: lista de imóveis com filtros
  p-imovel.html         ← portal: ficha de detalhe de um imóvel
  cadastro.html         ← portal: tutorial + importação de Excel
  g-changelog.html      ← changelog unificado (ficha + portal)

  js/
    g-config.js         ← constantes globais (credenciais, IDs) — PROTEGIDO
    g-versao.js         ← versões + changelogs + RASCUNHO dos agentes
    g-menu.js           ← sidebar injetada via IIFE em todas as páginas
    g-definicoes.js     ← glossário de termos imobiliários (tooltips)
    g-geo.js            ← geocodificação via Nominatim/OSM
    p-storage.js        ← Drive API: list, upload, download, delete
    p-parser.js         ← validação e parse do Excel
    p-render.js         ← renderização da ficha de detalhe
    p-cards.js          ← renderização dos cards no portal
    p-filtros.js        ← filtragem em memória
    p-import.js         ← pipeline completo de importação
    p-ui.js             ← toasts e modais
    p-mapa.js           ← mapa + PIN via Leaflet/OSM
    p-acoes.js          ← copiar link, WhatsApp, excluir

  css/
    g-global.css        ← sidebar CSS + design tokens
    p-style.css         ← estilos do portal

  dados/
    config-teste.js     ← flag DADOS_TESTE (true/false) — PROTEGIDO
    imoveis-teste.json  ← dados fictícios para teste local

  dominios/
    f-dominios.json     ← fonte única de dropdowns e atributos — PROTEGIDO

  .claude/
    agents/             ← subagentes: censor (revisor) e terminus (commit/push)
```

**Prefixos:** `f-` = ficha · `p-` = portal · `g-` = compartilhado

---

## Links

- Repositório: https://github.com/czarious/ficha-imovel
- GitHub Pages (produção): https://czarious.github.io/ficha-imovel/
- Documentação interna: `CLAUDE.md` (contexto e regras) · `DEPS.md` (referência técnica) · `BUGS.md` (catálogo de regressão)
