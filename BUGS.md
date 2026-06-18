<!-- arquivo: BUGS.md | versao: 1.0.0 -->

# BUGS.md — Catálogo de Erros e Checklist de Regressão

> **Finalidade:** memória dos bugs, erros e ausências que **já aconteceram** neste projeto.
> Serve como checklist de revisão: antes de fechar qualquer revisão, o Claude deve reler
> este arquivo e confirmar que nenhum dos padrões abaixo voltou no código tocado.
>
> O projeto cresce e o César não vai lembrar de tudo que já passamos — este arquivo lembra por nós.

## Como usar (instruções para o Claude)

1. **No início de toda revisão de código** (ou antes de um commit grande): reler este catálogo.
2. Para cada bug listado, verificar a linha **"Como verificar"** contra o código que mudou.
3. Se encontrar uma **regressão** (bug que voltou): corrigir e anotar a reincidência no campo "Histórico".
4. Se encontrar um **bug novo** durante o trabalho: adicionar uma entrada nova aqui, mesmo que já corrigido.
   Registrar o **padrão/causa raiz**, não só o sintoma pontual — é o padrão que se repete.
5. Numeração: `BUG-NNN` sequencial, nunca reaproveitar número.

## Formato de cada entrada

```
### BUG-NNN — título curto do padrão
- Categoria · Primeira vez: DD/Mmm/AAAA · Status: aberto | corrigido
- Sintoma: o que o usuário/dev vê de errado
- Causa raiz: o padrão por trás (o que realmente causa)
- Onde: arquivos/funções afetados
- Como verificar: passo objetivo para checar em revisão futura
- Histórico: datas/contextos em que apareceu
```

---

## Catálogo

### BUG-001 — Função itera só o array global e ignora os arrays paralelos (contextos)
- **Categoria:** Arquitetura de dados/estado · **Primeira vez:** 17/Jun/2026 · **Status:** corrigido
- **Sintoma:** ambientes dentro de uma edificação não atualizam progresso, não renumeram, ou somem ao editar.
- **Causa raiz:** quando se cria um segundo array de dados paralelo (ex.: `edificacoes[].ambientes` ao lado de `ambientes[]`), funções antigas que faziam `ambientes.find()/filter()` continuam olhando só o array global. Existe o helper `_ambContext(id)` justamente para resolver isso, mas é fácil esquecer de usá-lo em alguma função.
- **Onde:** `f-ficha.html` — `getDados`, `renderBlocoAmbiente`, `removerAmbiente`, `atualizarNomeAmbiente`, `atualizarProgresso`, `atualizarBanheiroSuite`, `limparComodo`.
- **Como verificar:** dar grep em `ambientes.find(` e `ambientes.filter(` no `f-ficha.html`. Toda ocorrência dentro de função que recebe um `id` de ambiente deve usar `_ambContext(id).arr`, não o `ambientes` global. Exceção legítima: `renumerarAmbientes`/`atualizarBotao`, que de propósito varrem o global E as edificações.
- **Histórico:** 17/Jun/2026 — `atualizarProgresso` ficou esquecido na 1ª implementação das Edificações; corrigido na revisão do mesmo dia.

### BUG-002 — Numeração automática não renumera após remoção em contexto novo
- **Categoria:** Arquitetura de dados/estado · **Primeira vez:** 17/Jun/2026 · **Status:** corrigido
- **Sintoma:** remover "Sala 1" deixa "Sala 2" como "Sala 2" (deveria virar "Sala 1"). Numeração fura.
- **Causa raiz:** a função de renumerar varria só o array global; ao adicionar um novo escopo (edificação), a renumeração não alcançava os ambientes daquele escopo.
- **Onde:** `f-ficha.html` — `renumerarAmbientes` / `renumerarLista`.
- **Como verificar:** adicionar 2+ ambientes do mesmo tipo num escopo, remover o primeiro, e conferir se os restantes renumeram a partir de 1. Garantir que **todo** escopo que contém ambientes é varrido por `renumerarAmbientes`. Testar também os 3 gatilhos que já quebraram: remover intermediário, restaurar do cache, e adicionar em escopo novo.
- **Histórico (⚠️ padrão campeão de reincidência — já voltou 3×):**
  - 21/Mai/2026 (v0.2.0) — origem do recurso: renumeração ao remover um quarto intermediário.
  - 29/Mai/2026 (v0.6.0) — numeração quebrava ao **restaurar cômodo do cache**; corrigido re-renderizando todos em ordem.
  - 17/Jun/2026 (v0.7.x) — voltou nas **Edificações**; refatorado em `renumerarLista(arr)` chamado para o imóvel e para cada `ed.ambientes`.
  - **Regra:** toda vez que mudar a forma de criar / remover / restaurar / agrupar cômodo, revisar a numeração antes de fechar.

### BUG-003 — Código órfão (CSS ou JS) após trocar classe, função ou abordagem
- **Categoria:** Dead code · **Primeira vez:** 12/Jun/2026 · **Status:** corrigido
- **Sintoma:** o arquivo acumula regras CSS que não estilizam mais nada, ou variáveis/funções JS que ninguém chama; o código incha sem efeito.
- **Causa raiz:** ao trocar a classe usada num elemento (ou a função de render por uma genérica, ou refatorar uma lógica), o antigo não é removido junto.
- **Onde:** `css/p-style.css` — ex.: `.btn-secundario` (trocado por `.btn-outline`), `.ficha-secao-ed` e `.ficha-ed-titulo` (sobraram do rascunho antes de usar `renderSecaoAccordion`). `f-ficha.html` — variáveis mortas e comentários CORR-1..7 (v0.7.3).
- **Como verificar:** para cada classe/variável/função nova ou alterada numa sessão, dar grep do nome **antigo** em `*.html`, `*.js` e `*.css`. Zero ocorrências (fora da própria definição) = remover.
- **Histórico:**
  - 12/Jun/2026 (v0.7.3) — variáveis mortas eliminadas, `limparComodo()` simplificada, comentários CORR-1..7 removidos.
  - 17/Jun/2026 (v0.7.x) — 3 classes CSS órfãs removidas após os fixes de Edificações e dos botões.

### BUG-004 — Estilo feito para um fundo reaproveitado em fundo de contraste oposto
- **Categoria:** UI/CSS (contraste) · **Primeira vez:** 17/Jun/2026 · **Status:** corrigido
- **Sintoma:** texto/ícone quase invisível (ex.: botões "Copiar link", "Imprimir", "Excluir" sumindo na barra clara).
- **Causa raiz:** classe com `color: white` + fundo translúcido foi criada para a sidebar/header verde e reaproveitada numa barra de fundo claro.
- **Onde:** `p-imovel.html` (barra de ações) — usava `.btn-secundario`/`.btn-fantasma`.
- **Como verificar:** ao reusar uma classe de botão/badge num lugar novo, conferir o fundo daquele lugar. Texto claro só sobre fundo escuro e vice-versa. Na dúvida, abrir no Live Server e olhar.
- **Histórico:** 17/Jun/2026 — barra de ações migrada para `.btn-outline` (verde sobre claro).

### BUG-005 — Validação/exclusão não atualizada ao criar nova linha-marcadora no Excel
- **Categoria:** Parser / contrato Excel · **Primeira vez:** 17/Jun/2026 · **Status:** corrigido
- **Sintoma:** um arquivo só com marcadores (sem cômodo real) passa na validação "ao menos um cômodo" e gera objeto vazio.
- **Causa raiz:** o parser tem listas de palavras-chave da coluna A que **não** são cômodo (`Anunciante`, `Imóvel`). Ao introduzir um novo marcador (`[Edificação]`), as listas de validação/roteamento precisam ser atualizadas em conjunto, mas é fácil atualizar uma e esquecer a outra.
- **Onde:** `js/p-parser.js` — validação "ao menos um cômodo" e roteamento por coluna A.
- **Como verificar:** ao adicionar qualquer keyword nova na coluna A do contrato Excel, procurar em `p-parser.js` **todos** os pontos que listam `'Anunciante'`/`'Imóvel'` e garantir que o novo marcador foi incluído em cada um.
- **Histórico:** 17/Jun/2026 — `[Edificação]` adicionado à exclusão da validação de cômodo.

### BUG-006 — Nova seção renderizada sem o wrapper visual padrão
- **Categoria:** UI/CSS · **Primeira vez:** 17/Jun/2026 · **Status:** corrigido
- **Sintoma:** seção nova (Edificações) aparece "solta", sem o card branco com borda/sombra/ícone das demais.
- **Causa raiz:** a função de render da seção nova injetou só o título, sem o esqueleto `.secao > .secao-header + .secao-body` que as outras seções usam.
- **Onde:** `f-ficha.html` — `renderSecaoEdificacoes` (e qualquer `renderSecaoX` futura).
- **Como verificar:** comparar a nova função de render com `renderComodos`/`renderLocalizacao`. Deve seguir a mesma estrutura de wrapper. Conferir visualmente no Live Server lado a lado com uma seção existente.
- **Histórico:** 17/Jun/2026 — `renderSecaoEdificacoes` reescrito com o wrapper `.secao` completo.

### BUG-007 — Código duplicado/hardcoded em vez de reusar a fonte única
- **Categoria:** Arquitetura (DRY) · **Primeira vez:** 17/Jun/2026 · **Status:** corrigido
- **Sintoma:** um caminho da feature diverge do outro (ex.: edificação só criava "Sala" fixa, sem os tipos de `dom.tipos_ambiente`; lista de tipos hardcoded não acompanha a fonte única).
- **Causa raiz:** ao estender uma feature para um novo contexto, reimplementa-se um pedaço em vez de parametrizar o existente. Os dois caminhos passam a precisar de manutenção dobrada e divergem.
- **Onde:** `f-ficha.html` — seletor de tipo de ambiente (`opcoesTipoAmb`/`htmlSeletorAmb` reusados por imóvel e edificação).
- **Como verificar:** ao implementar "o mesmo recurso em outro lugar", checar se há uma função/fonte única a reaproveitar (ex.: `dom.*` do `f-dominios.json`) antes de escrever código novo. Listas literais de opções que já existem em `dom.*` são sinal de alerta.
- **Histórico:** 17/Jun/2026 — seletor unificado; tipo novo em `dom.tipos_ambiente` passa a aparecer no imóvel e nas edificações automaticamente.

### BUG-008 — Campo oculto ao trocar tipo/modo continua valendo no cálculo ou no export
- **Categoria:** Arquitetura de dados/estado · **Primeira vez:** 15/Jun/2026 · **Status:** corrigido
- **Sintoma:** Área total inclui a área comum mesmo num imóvel sem condomínio (depois de trocar o Tipo de imóvel).
- **Causa raiz:** ao trocar o tipo, o campo condicional some da tela (display:none), mas o valor antigo continua em `dadosLocalizacao` e entra no cálculo/export. **Ocultar um campo ≠ zerar o campo.**
- **Onde:** `f-ficha.html` — `calcularAreaTotal` / `atualizarVisibilidadeAreas`. Mesmo risco em **Custos** (campos por modalidade) e **Edificações** (campos por tipo).
- **Como verificar:** preencher um campo condicional, trocar para um tipo/modalidade que o esconde, e conferir se ele saiu dos cálculos **e** do Excel exportado. Regra: ao ocultar campo condicional, ignorar/zerar o valor em todo cálculo e no export.
- **Histórico:** 15/Jun/2026 (v0.7.5) — `calcularAreaTotal()` somava `área_comum` em tipos sem condomínio ao trocar o tipo de imóvel.

### BUG-009 — Mapa Leaflet renderiza parcial ("canto cinza") em container oculto/redimensionado
- **Categoria:** UI / libs externas · **Primeira vez:** 15/Jun/2026 · **Status:** corrigido
- **Sintoma:** o mapa abre quebrado, com parte da área cinza, na ficha do imóvel.
- **Causa raiz:** o Leaflet mede o container na inicialização; se ele ainda não tem o tamanho final (página montando, accordion/aba fechada), o mapa calcula dimensão errada. Precisa de `invalidateSize()` depois que o container ganha tamanho.
- **Onde:** `js/p-mapa.js` — hoje resolvido com `setTimeout(() => mapa.invalidateSize(), 200)`.
- **Como verificar:** abrir `p-imovel.html` e conferir o mapa inteiro. Se um dia o mapa for movido para dentro de algo que abre depois (accordion/aba), chamar `invalidateSize()` **no evento de abertura**, não confiar só no timeout fixo.
- **Histórico:** 15/Jun/2026 (v0.7.5).

### BUG-010 — Arquivo enviado ao Drive nasce privado e não aparece no portal
- **Categoria:** Storage / Drive API · **Primeira vez:** 08/Jun/2026 · **Status:** corrigido
- **Sintoma:** imóvel importado com sucesso não aparece na listagem (para outros usuários / aba anônima).
- **Causa raiz:** arquivo criado via Drive API nasce privado (só o dono). Sem setar permissão pública, o portal não lista/baixa.
- **Onde:** `js/p-storage.js` — `tornarArquivoPublico()` (POST em `/permissions` com `role:'reader', type:'anyone'`); deve rodar após todo upload.
- **Como verificar:** todo fluxo novo que crie arquivo no Drive precisa chamar `tornarArquivoPublico()`. Testar importando e abrindo o portal numa aba anônima (sem login).
- **Histórico:** 08/Jun/2026 (v0.7.0).

### BUG-011 — Biblioteca de CDN usada antes de terminar de carregar
- **Categoria:** Carregamento / libs externas · **Primeira vez:** 28/Mai/2026 · **Status:** corrigido
- **Sintoma:** OAuth não inicializa no primeiro uso (falha intermitente).
- **Causa raiz:** o código chamava a API do Google Identity Services antes do script da CDN carregar. Lib externa só pode ser usada depois do `onload`.
- **Onde:** `index.html` — `_gsi.onload = () => inicializarOAuth()`. Vale para **qualquer** `<script src=CDN>`: GIS, Leaflet, SheetJS.
- **Como verificar:** todo uso de lib de CDN deve ocorrer após o load dela (`onload`, callback, ou checagem `typeof Lib !== 'undefined'`). Não assumir que a lib está pronta no `DOMContentLoaded`.
- **Histórico:** 28/Mai/2026 (v0.6.1) — GIS sem `onload`.

### BUG-012 — Nome do arquivo Excel exportado fora do padrão do contrato
- **Categoria:** Parser / contrato Excel · **Primeira vez:** 26/Mai/2026 · **Status:** corrigido
- **Sintoma:** arquivo exportado com nome errado → parser rejeita na importação ou a deduplicação falha.
- **Causa raiz:** o nome do arquivo faz parte do contrato (`FT_{CEP}_{Numero}_{Complemento}.xlsx`); a montagem do nome divergiu do esperado.
- **Onde:** `f-ficha.html` (montagem do nome em `exportarExcel`) ↔ `js/p-parser.js` (exige prefixo `FT_`).
- **Como verificar:** ao mexer no export ou em campos que compõem o nome (CEP, número, complemento), exportar e conferir o nome contra `FT_*`. Caracteres especiais do complemento têm de ser sanitizados.
- **Histórico:** 26/Mai/2026 (v0.3.0).

### BUG-013 — Conteúdo dinâmico longo estoura o layout
- **Categoria:** UI/CSS · **Primeira vez:** 08/Jun/2026 · **Status:** corrigido
- **Sintoma:** título/texto longo quebra ou empurra o layout (ex.: títulos do changelog estouravam).
- **Causa raiz:** texto vindo de dados (título de versão, tipo "Outro..." livre, complemento) sem limite de linha/truncamento empurra o container.
- **Onde:** qualquer render de texto livre — cards, títulos, badges, accordions, nomes de cômodo/edificação.
- **Como verificar:** testar com texto propositalmente longo (tipo "Outro" com 40+ caracteres, complemento longo) e ver se o layout aguenta (ellipsis, truncamento ou wrap controlado).
- **Histórico:** 08/Jun/2026 (v0.7.1) — títulos do changelog estouravam o layout.

### BUG-014 — Mudar a visibilidade de um campo sem atualizar a lógica acoplada que dependia dele
- **Categoria:** Arquitetura de dados/estado · **Primeira vez:** 17/Jun/2026 · **Status:** corrigido
- **Sintoma:** ao ocultar a Área privativa para Chácara/Sítio/Fazenda/Galpão/Prédio Comercial (multi-edificação), a **Área total e o R$/m² do imóvel ficaram vazios** — os cálculos só sabiam usar privativa (ou terreno p/ lote) e ficaram sem fonte de dado.
- **Causa raiz:** mexer na UI (esconder um campo condicional por tipo) **sem atualizar as funções que liam esse campo**. Visibilidade e cálculo estavam acoplados, mas só a visibilidade foi mexida. É o primo do [[BUG-008]] (lá o valor oculto continuava valendo; aqui o cálculo ficou sem fonte).
- **Onde:** `f-ficha.html` — `calcularAreaTotal`, `calcularRporM2` (área de referência por tipo).
- **Como verificar:** ao ocultar/condicionar um campo por tipo/modo, dar grep no nome do campo e achar **toda** função que o lê; garantir que cada tipo afetado tem uma fonte válida. Depois, verificar o cálculo **na mão** para cada tipo (ver regra "feito na mão" no CLAUDE.md). Área de referência atual por tipo: edificados → privativa; Lote + rurais (Chácara/Sítio/Fazenda) → terreno; Galpão/Prédio Comercial → soma das áreas construídas das edificações.
- **Histórico:** 17/Jun/2026 introduzido nas Edificações (ocultou privativa sem atualizar cálculo); 18/Jun/2026 corrigido — área de referência por tipo, com padrão de mercado confirmado em fontes BR (rural = terreno/hectare; galpão e laje corporativa = área construída/locável).

### BUG-015 — tooltipInit() chamado uma única vez não alcança elementos .campo-tip criados dinamicamente depois
- **Categoria:** Inicialização / DOM dinâmico · **Primeira vez:** 18/Jun/2026 · **Status:** corrigido
- **Sintoma:** tooltip de label criado em tempo de execução (ex.: "Área construída" dentro de um card de edificação) fica vazio ao hover e sem reação a clique — listeners nunca foram anexados.
- **Causa raiz:** `tooltipInit()` foi chamado uma única vez dentro de `renderLocalizacao()`. Elementos `.campo-tip[data-def]` adicionados depois (por `adicionarEdificacao()` via `appendChild`) nunca passaram pelo loop de injeção de texto nem pelo loop de `addEventListener`.
- **Onde:** `f-ficha.html` — `tooltipInit()` e toda função que cria dinamicamente um elemento com classe `.campo-tip`.
- **Como verificar:** toda função que faz `appendChild` ou `innerHTML` com um elemento `.campo-tip` deve chamar `tooltipInit()` logo após. Grep por `campo-tip` no HTML gerado em JS e conferir se a função que o contém também chama `tooltipInit()`.
- **Histórico:** 18/Jun/2026 — descoberto na revisão pós-feature; corrigido adicionando `tooltipInit()` ao final de `adicionarEdificacao()`.

### BUG-016 — tooltipInit() sem guard contra dependência externa não carregada
- **Categoria:** Robustez / carregamento de scripts · **Primeira vez:** 18/Jun/2026 · **Status:** corrigido
- **Sintoma:** se `g-definicoes.js` não carregar (404 ou erro de parse), `DEFINICOES` é `undefined`; a primeira linha de `tooltipInit()` que toca `DEFINICOES[...]` lança `ReferenceError` e aborta a função inteira — **nenhum** tooltip funciona na ficha.
- **Causa raiz:** código que depende de variável global definida em outro arquivo não verificava se ela existia antes de acessar.
- **Onde:** `f-ficha.html` — topo de `tooltipInit()`. Padrão genérico: toda função que usa global de arquivo externo.
- **Como verificar:** ao criar função que depende de global de outro arquivo (`g-*.js`), a primeira linha deve ser `if (typeof NOME === 'undefined') return;` ou equivalente. O padrão correto já existe em `p-render.js` (`typeof getDefPorLabel === 'function'`).
- **Histórico:** 18/Jun/2026 — corrigido com `if (typeof DEFINICOES === 'undefined') return;` no topo de `tooltipInit()`.

### BUG-017 — CSS compartilhado duplicado em dois arquivos em vez de estar no CSS global
- **Categoria:** Dead code / manutenção · **Primeira vez:** 18/Jun/2026 · **Status:** aberto
- **Sintoma:** qualquer ajuste visual no tooltip (sombra, border-radius, z-index) precisa ser feito em dois lugares; `.tooltip-prova` já só existe em `f-ficha.html`, provando que os dois já divergiram.
- **Causa raiz:** o bloco `.campo-tip` foi adicionado tanto em `f-ficha.html` (inline `<style>`) quanto em `css/p-style.css`. A intenção era compartilhar, mas a implementação parou no meio — o lugar certo seria `css/g-global.css` (stylesheet já carregado por todas as páginas).
- **Onde:** `f-ficha.html` linhas 77-84; `css/p-style.css` bloco `.campo-tip`.
- **Como verificar:** grep por `.campo-tip` em `f-ficha.html`, `css/p-style.css` e `css/g-global.css`. Deve existir em **apenas um lugar** (g-global.css). Conferir que `.tooltip-prova` também migrou.
- **Histórico:** 18/Jun/2026 — detectado na revisão; não corrigido ainda (baixo risco imediato).

### BUG-018 — Lógica de routing de tipo de imóvel (TIPOS_*) duplicada em 3 funções
- **Categoria:** Arquitetura (DRY) · **Primeira vez:** 18/Jun/2026 · **Status:** aberto
- **Sintoma:** ao adicionar um novo tipo de imóvel, há 3 lugares que precisam ser atualizados em sincronia: `calcularAreaTotal()`, `calcularRporM2()` e `atualizarTooltipsProva()`. Esquecendo um, o cálculo fica certo mas a tooltip mostra a fórmula errada — falha silenciosa.
- **Causa raiz:** `atualizarTooltipsProva()` precisava do mesmo branching `TIPOS_ED_AREA_CONSTRUIDA / TIPOS_SEM_EDIFICACAO / TIPOS_COM_EDIFICACOES / TIPOS_COM_CONDOMINIO` das funções de cálculo, e foi implementado como 3ª cópia em vez de extrair `resolverAreaBase(tipo)` como helper compartilhado.
- **Onde:** `f-ficha.html` — `calcularAreaTotal()`, `calcularRporM2()`, `atualizarTooltipsProva()`.
- **Como verificar:** grep por `TIPOS_ED_AREA_CONSTRUIDA` em `f-ficha.html`; o número de ocorrências deve ser 1 (na declaração) mais o helper centralizado. Mais de 1 ocorrência de uso = duplicação.
- **Histórico:** 18/Jun/2026 — detectado na revisão; não refatorado (impacto baixo agora, alto ao escalar tipos).

### BUG-019 — escaparHTML() aplicado a conteúdo de autor confiável — double-encoding silencioso
- **Categoria:** Arquitetura / renderização · **Primeira vez:** 18/Jun/2026 · **Status:** aberto
- **Sintoma:** qualquer HTML entity escrita em `g-definicoes.js` (ex.: `&mdash;`, `&nbsp;`) seria exibida literalmente como `&amp;mdash;` no tooltip do portal — sem erro visível, só texto errado.
- **Causa raiz:** `p-render.js` usa `escaparHTML(def.texto)` para injetar o texto da definição no HTML do tooltip, mas `g-definicoes.js` é conteúdo de autor (source controlado, não user input). `escaparHTML` converte `&` em `&amp;`, o que double-encoda qualquer entity. O padrão correto para conteúdo confiável é usar o texto diretamente (como `insertAdjacentText` faz na ficha).
- **Onde:** `js/p-render.js` linha 329; `js/g-definicoes.js` (regra de autoria).
- **Como verificar:** grep por `escaparHTML(def.` em `p-render.js`. Se existir, avaliar se o conteúdo é de autor (confiável → remover `escaparHTML`) ou user input (não confiável → manter). Garantir que `g-definicoes.js` documenta que os textos devem usar Unicode puro, nunca HTML entities.
- **Histórico:** 18/Jun/2026 — detectado na revisão; não corrigido (textos atuais são ASCII/Unicode puro, sem risco imediato).

---

## Armadilhas de processo (não-código)

Estas não são bugs de código, mas erros de fluxo que já custaram retrabalho. Detalhes completos no **CLAUDE.md**.

- **DADOS_TESTE:** editar com `dados/config-teste.js` em `true`; commitar só com `false`; restaurar `true` depois. Verificar no início de cada sessão.
- **DEPS.md desatualizado:** todo bump de versão precisa refletir em DEPS.md no mesmo commit. Conferir antes do push.
- **Versão pré-atribuída:** não escrever número de versão no cabeçalho de um arquivo antes de a feature ser de fato commitada.
