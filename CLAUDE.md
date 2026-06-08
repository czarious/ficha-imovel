# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O Projeto

**Zillow BR** (nome em avaliação: Brillow) — proptech imobiliária com ficha técnica profunda de imóveis. Produto real em desenvolvimento, não portfólio.

Repositório: https://github.com/czarious/ficha-imovel
GitHub Pages: https://czarious.github.io/ficha-imovel/
Parceiros: Eduardo Afonso (C5P Engenharia, CREA) e Luciana (arquiteta, CREA).

Duas partes:
1. **Ficha** (`f-ficha.html`) — formulário que coleta dados do imóvel e exporta Excel
2. **Portal** (raiz do repo) — importa os Excel, armazena no Google Drive, exibe com filtros

Sem build, sem package manager, sem framework. HTML + CSS + JS puro via CDN.

## Sobre o César

Engenheiro Civil, Ribeirão Preto/SP. Perfil híbrido: engenharia + processos + dados.
Não é desenvolvedor de formação — aprendeu desenvolvendo este projeto.
**Inclua dicas de aprendizado ao longo do trabalho** (aprende por osmose).

Nível técnico:
- HTML/CSS/JS: leitura e edição guiada — intermediário
- Git: usa GitHub Desktop, entende commit/push
- API: já integrou Google Drive API e OAuth 2.0 neste projeto

## Como Trabalhar

- **Apresente o raciocínio antes de executar e aguarde confirmação**
- Um arquivo por vez — aguarde confirmação antes do próximo
- Textos para copiar sempre em bloco de código (` ``` `)
- Verifique referências cruzadas antes de entregar qualquer arquivo
- Indique o destino no topo de cada arquivo: `<!-- DESTINO: pasta/arquivo.html -->`
- Respostas diretas e sem enrolação
- Nunca atualize o Obsidian sem mostrar o conteúdo antes e aguardar aprovação

## Fluxo de Dados

```
César preenche o formulário (f-ficha.html)
  → exporta FT_{CEP}_{Numero}_{Complemento}.xlsx
    → faz upload no portal (index.html)
      → p-parser.js valida e parseia o Excel
        → p-storage.js sobe para o Google Drive
          → arquivos listados/baixados do Drive no carregamento
            → p-filtros.js filtra o array em memória (_todosImoveis)
              → p-cards.js renderiza os cards
                → clique → p-imovel.html (detalhe via p-render.js)
```

## Módulos Compartilhados (prefixo `g-`)

| Arquivo | Responsabilidade |
|---------|-----------------|
| `css/g-global.css` | Sidebar CSS + tokens; `body { margin-left: var(--sidebar-w) }` |
| `js/g-menu.js` | Injeta `<aside id="sidebar">` via IIFE; cada página declara `MENU_BASE` antes de carregar |
| `js/g-config.js` | Fonte única de verdade: Drive folder ID, API key, Client ID, constantes do app |
| `js/g-versao.js` | `VERSAO_PORTAL` + `VERSAO_ATUAL` + changelogs + `abrirChangelog()` / `abrirChangelogPortal()` |
| `js/g-geo.js` | `geocodificarEndereco(endereço)` → `{lat,lng}` via Nominatim/OSM (adapter trocável) |

Todas as páginas estão na raiz do repo, então todas usam:
```html
<script>const MENU_BASE = './';</script>
<script src="js/g-menu.js"></script>
```

## Módulos do Portal

| Arquivo | Responsabilidade |
|---------|-----------------|
| `p-storage.js` | Todas as chamadas à Drive API (list, download, upload, delete) + OAuth |
| `p-parser.js` | Validação e parse do Excel em objeto JS estruturado |
| `p-filtros.js` | Filtragem em memória; dropdowns cascata estado→cidade |
| `p-cards.js` | Geração de HTML dos cards e empty states |
| `p-render.js` | Página de detalhe (badges, tabela resumo, acordeões) |
| `p-ui.js` | Toasts (auto-dismiss 3s) e modais |
| `p-mapa.js` | Renderiza mapa + PIN na ficha do imóvel via Leaflet/OSM (adapter trocável) |
| `p-import.js` | Pipeline de importação do Excel (parse→valida→duplicata→salva); usado por index e cadastro |
| `p-acoes.js` | Ações da ficha do imóvel: copiar link, WhatsApp, excluir |

## Contrato Excel

O Excel é o contrato de dados entre Ficha e Portal. O parser (`p-parser.js`) exige:
- Nome do arquivo: `FT_*.xlsx` ou `FT_*.xlsm`
- 4 colunas: `Cômodo | Grupo | Característica | Valor`
- Linhas obrigatórias: `Anunciante`, `Imóvel`, CEP não vazio, ao menos um cômodo
- Linhas opcionais: `Imóvel | Localização | Latitude` e `Longitude` — gravadas pela Ficha via geocodificação (Nominatim) para alimentar o mapa

Detecção de duplicata usa CEP + Numero + Complemento como chave composta.

`dominios/f-dominios.json` é a fonte única para todos os dropdowns e atributos de cômodos.

## Convenções Obrigatórias

- Prefixo `f-` = ficha, `p-` = portal
- Cabeçalho obrigatório em todo arquivo:
  - JS/CSS: `/* arquivo: nome.js | versao: X.X.X */`
  - HTML: `<!-- arquivo: nome.html | versao: X.X.X -->`
  - JSON: campo `"_arquivo": "nome | versao: X.X.X"`
- Versão atual: portal `0.7.0` / ficha `0.7.0`
- Patch = Z (bug fix), Minor = Y (feature nova), Major = X (mudança radical)
- Categorias do changelog: **Interface & Funcionalidades** e **Sistema & Código**
- Datas no formato `DD/Mmm/AAAA`

## Documentação no Obsidian

Vault em `G:\Meu Drive\Obsidian\MCP-OC`, pasta `04-projetos/zillow-br/`.

**Ler antes de continuar** — contém decisões que não estão no código:
- `zillow-br-melhorias.md` — backlog completo priorizado
- `zillow-br-historico.md` — histórico de sessões e decisões de arquitetura
- `zillow-br-oauth-usuarios.md` — configuração do Google Cloud e OAuth

Decisões importantes documentadas lá (ainda não implementadas):
- Refatoração estrutural: repositório → `proptech`, nova estrutura de pastas
- ~~`g-versao.js` unificado substituindo `f-versao.js` + `p-versao.js`~~ **✓ implementado em v0.6.2**
- ~~`g-config.js` substituindo `p-config.js`~~ **✓ implementado em v0.6.2**
- Reestruturação dos cômodos no Excel (banheiro como cômodo independente)
- ~~`global.css` compartilhado + menu lateral fixo~~ **✓ implementado em v0.6.1**

## Google Cloud

- Projeto: `zillow-br`
- Client ID OAuth: `832827471837-plg29c5fp7li553vdgjmk0tf0gb1dfqd.apps.googleusercontent.com`
- Escopo OAuth: `https://www.googleapis.com/auth/drive`
- API Key: restrita ao domínio `czarious.github.io` e à Drive API
- Pasta Drive ID: `1KXAeBciVmNMf0rkhBtSNvpSEuWvxgP-t`
- Permissão da pasta: Editor (obrigatório para upload via OAuth)

## Backlog

### Alta Prioridade

**Portal:**
- ~~Botão copiar link da ficha (`p-imovel.html?id=xxx`)~~ **✓ implementado em v0.6.2**
- ~~Avatar com iniciais do anunciante nos cards — círculo, canto superior esquerdo~~ **✓ implementado em v0.6.2**

**Ficha:**
- ~~Campo Complemento: select + número, monta "Apartamento 13"~~ **✓ implementado em v0.6.1**
- ~~Validação obrigatória: destaque vermelho sem CEP ou Número~~ **✓ implementado em v0.6.1**
- ~~Campos novos no Anunciante: Responsável pela venda + WhatsApp do responsável~~ **✓ implementado em v0.6.2**
- Campo de custos na Localização: Condomínio (R$/mês) + IPTU (R$/ano)

### Média Prioridade

**Portal:**
- Contagem de leads via Google Sheets (clique no WhatsApp → registra linha)
- Sistema de usuários — e-mail do anunciante como identificador

**Ficha:**
- Mais tipos de cômodo (aguardando lista da Luciana)
- Atributos de cor — Piso/Cor e Parede/Cor
- Ventilador de teto em Climatização
- Interruptores em Elétrica
- Preview do nome do arquivo antes de exportar

### Baixa Prioridade
- Exportar ficha como PDF
- Validação de CRECI
- ~~Mapa com PIN por endereço~~ **✓ implementado em v0.7.0** (Leaflet/OSM + geocodificação Nominatim; precisão nível-rua). Futuro: PIN arrastável na Ficha para precisão exata; migração p/ Google Maps isolada nos adapters `g-geo.js` / `p-mapa.js`
- Google Picker API (substituir escopo `drive` por `drive.file` com seleção explícita)
- Campo de observações por cômodo
- Reordenar cômodos (drag and drop)
- Duplicar cômodo
- Versão mobile

### Estrutural — versão dedicada
- Refatoração completa: repositório → `proptech`, nova estrutura de pastas
- ~~`global.css` + menu lateral~~ **✓ implementado em v0.6.1** (incrementalmente, sem quebrar)
- ~~Eliminar pastas `portal/` e `ficha/` — tudo na raiz com prefixos~~ **✓ concluído em v0.6.2**
- Reestruturação dos cômodos no Excel: banheiro como cômodo independente (`banheiro_1`, `banheiro_suite_1`)

### Refatoração incremental em andamento

| Fase | Status | Descrição |
|------|--------|-----------|
| Fase 1 | ✓ Concluída | `global.css` + `g-menu.js` + sidebar em `index.html` e `p-imovel.html` |
| Fase 2 | ✓ Concluída | `cadastro.html` (tutorial + 2 CTAs) + link ativo na sidebar + import removido do Home |
| Fase 3 | ✓ Concluída | Sidebar adicionada à ficha + `f-ficha.html`; pastas `portal/` e `ficha/` eliminadas — tudo na raiz |
| Fase 4 | ✓ Concluída | `g-versao.js` unificado substituindo `f-versao.js` + `p-versao.js` |
| Fase 5 | ✓ Concluída | `g-config.js` substituiu `p-config.js`; expandido com `APP_NOME` e constantes globais |

## Dependências Externas (CDN)

- **SheetJS** `0.18.5` — leitura/escrita de Excel
- **Google Identity Services** — OAuth 2.0
- **Google Drive API** v3
- **ViaCEP** — lookup de CEP (ficha only)
- **Leaflet** `1.9.4` — mapa (`p-imovel.html` only)
- **Nominatim / OpenStreetMap** — geocodificação (`g-geo.js`) + tiles do mapa
- **Google Fonts** — DM Sans + DM Serif Display

## Design Tokens

```css
--verde-escuro: #2B5F3E   /* primary accent */
--areia:        #F5F3EE   /* background */
--texto:        #1a1a1a
--cinza-claro:  #e0ddd8
```

Breakpoint responsivo: `600px`.
