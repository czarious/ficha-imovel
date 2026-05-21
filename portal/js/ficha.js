/* ============================================================
   ficha.js — Renderização da ficha técnica completa (imovel.html)
   Depende de: ui.js (formatarData, formatarEndereco)
   v0.3.0 — accordion + tabela resumo + área total
   ============================================================ */

/**
 * Renderiza a ficha técnica completa de um imóvel no container designado.
 * @param {Object|null} imovel
 */
function renderizarFicha(imovel) {
  const container = document.getElementById('ficha-container');
  if (!container) return;

  if (!imovel) {
    container.innerHTML = `
      <div class="ficha-erro">
        <h3>Imóvel não encontrado</h3>
        <p>O ID informado não corresponde a nenhum imóvel cadastrado.</p>
        <a href="index.html" class="btn btn-verde" style="margin-top:20px;display:inline-flex;">
          ← Voltar ao portal
        </a>
      </div>`;
    return;
  }

  const loc = imovel.localizacao || {};
  const cad = imovel.anunciante || {};
  const endereco = formatarEndereco(loc);

  document.title = `${endereco} — Zillow BR`;

  /* ── Cabeçalho ── */
  let html = `
    <header class="ficha-cabecalho">
      <h1 class="ficha-titulo">${loc['Rua'] || 'Imóvel'}, ${loc['Número'] || loc['Numero'] || ''}</h1>
      <p class="ficha-subtitulo">
        ${loc['Cidade'] || ''}${loc['Estado'] ? ', ' + loc['Estado'] : ''}
        ${loc['CEP'] ? '&nbsp;·&nbsp; CEP ' + loc['CEP'] : ''}
      </p>
      ${loc['Complemento'] ? `<p class="ficha-complemento">${loc['Complemento']}</p>` : ''}
      <span class="ficha-importado">📅 Importado em ${formatarData(imovel.importadoEm, 'longo')}</span>
    </header>`;

  /* ── Tabela resumo de cômodos (estilo Zillow) ── */
  if (imovel.comodos && imovel.comodos.length > 0) {
    html += renderTabelaResumo(imovel.comodos);
  }

  /* ── Seção: Localização — aberta por padrão ── */
  if (Object.keys(loc).length > 0) {
    html += renderSecaoAccordion(
      'localizacao',
      '📍 Localização',
      `<div class="ficha-grid-atributos">
        ${Object.entries(loc).map(([k, v]) => renderAtributo(k, v)).join('')}
      </div>`,
      true  // aberta por padrão
    );
  }

  /* ── Seção: Anunciante — fechada por padrão ── */
  if (Object.keys(cad).length > 0) {
    html += renderSecaoAccordion(
      'cadastrante',
      '👤 Cadastrante',
      `<div class="ficha-grid-atributos">
        ${Object.entries(cad).map(([k, v]) => renderAtributo(k, v)).join('')}
      </div>`,
      false  // fechada por padrão
    );
  }

  /* ── Seção: Cômodos — cada um colapsável ── */
  if (imovel.comodos && imovel.comodos.length > 0) {
    const comodosHTML = imovel.comodos.map((c, idx) =>
      renderComodoAccordion(c, idx)
    ).join('');

    html += `
      <section class="ficha-secao">
        <h2 class="ficha-secao-titulo">🏠 Detalhamento por cômodo</h2>
        <div class="comodos-lista">${comodosHTML}</div>
      </section>`;
  }

  container.innerHTML = html;

  /* ── Inicializa accordions após injetar HTML ── */
  inicializarAccordionsFicha();
}

/* ================================================================
   TABELA RESUMO — estilo Zillow
   ================================================================ */

/**
 * Monta a tabela resumo compacta no topo da ficha.
 * Exibe nome do cômodo, metragem e área total calculada.
 * @param {Array} comodos
 * @returns {string}
 */
function renderTabelaResumo(comodos) {
  /* Extrai metragem de cada cômodo */
  const linhas = comodos.map(comodo => {
    const area = extrairArea(comodo);
    return `
      <tr class="resumo-linha">
        <td class="resumo-nome">${escaparHTML(comodo.nome)}</td>
        <td class="resumo-area">${area ? area + ' m²' : '—'}</td>
      </tr>`;
  }).join('');

  /* Calcula área total dos cômodos com metragem informada */
  const areaTotal = comodos.reduce((soma, c) => {
    const a = parseFloat(extrairArea(c)) || 0;
    return soma + a;
  }, 0);

  const totalHTML = areaTotal > 0
    ? `<tr class="resumo-total">
        <td>Área total dos cômodos</td>
        <td>${areaTotal.toFixed(2)} m²</td>
      </tr>`
    : '';

  return `
    <section class="ficha-resumo-wrap">
      <h2 class="ficha-resumo-titulo">Resumo</h2>
      <table class="ficha-resumo-tabela">
        <thead>
          <tr>
            <th>Cômodo</th>
            <th>Metragem</th>
          </tr>
        </thead>
        <tbody>
          ${linhas}
          ${totalHTML}
        </tbody>
      </table>
    </section>`;
}

/**
 * Extrai o valor de área total de um cômodo a partir dos seus grupos.
 * Procura pelo item "Área total (m²)" no grupo "Dimensões".
 * @param {Object} comodo
 * @returns {string|null}
 */
function extrairArea(comodo) {
  for (const grupo of (comodo.grupos || [])) {
    for (const item of (grupo.itens || [])) {
      if (
        item.caracteristica === 'Área total (m²)' ||
        item.caracteristica === 'Area total (m2)'
      ) {
        return item.valor || null;
      }
    }
  }
  return null;
}

/* ================================================================
   ACCORDION DE SEÇÃO (Localização / Cadastrante)
   ================================================================ */

/**
 * Gera uma seção com header clicável (accordion).
 * @param {string} id — identificador único da seção
 * @param {string} titulo — texto do header
 * @param {string} conteudoHTML — HTML interno da seção
 * @param {boolean} aberta — estado inicial
 * @returns {string}
 */
function renderSecaoAccordion(id, titulo, conteudoHTML, aberta) {
  return `
    <section class="ficha-secao ficha-secao-accordion" id="sec-${id}">
      <h2 class="ficha-secao-titulo ficha-secao-toggle" onclick="toggleSecaoFicha('${id}')">
        <span>${titulo}</span>
        <span class="ficha-secao-arrow ${aberta ? 'aberto' : ''}" id="arrow-sec-${id}">▾</span>
      </h2>
      <div class="ficha-secao-corpo" id="corpo-sec-${id}" style="display:${aberta ? 'block' : 'none'}">
        ${conteudoHTML}
      </div>
    </section>`;
}

/**
 * Abre/fecha uma seção accordion da ficha.
 * @param {string} id
 */
function toggleSecaoFicha(id) {
  const corpo = document.getElementById('corpo-sec-' + id);
  const arrow = document.getElementById('arrow-sec-' + id);
  if (!corpo) return;
  const aberto = corpo.style.display !== 'none';
  corpo.style.display = aberto ? 'none' : 'block';
  arrow?.classList.toggle('aberto', !aberto);
}

/* ================================================================
   ACCORDION DE CÔMODO
   ================================================================ */

/**
 * Gera o card de um cômodo com header colapsável.
 * Primeiro cômodo abre por padrão, demais fecham.
 * @param {Object} comodo
 * @param {number} idx — índice (0-based)
 * @returns {string}
 */
function renderComodoAccordion(comodo, idx) {
  const aberto = idx === 0; // primeiro cômodo abre, demais fecham
  const area   = extrairArea(comodo);
  const idComodo = 'comodo-' + idx;

  const gruposHTML = comodo.grupos.map(grupo => `
    <div class="grupo-bloco">
      <h4 class="grupo-titulo">${escaparHTML(grupo.nome)}</h4>
      <div class="ficha-grid-atributos">
        ${grupo.itens.map(item => renderAtributo(item.caracteristica, item.valor)).join('')}
      </div>
    </div>`).join('');

  return `
    <div class="comodo-card">
      <div class="comodo-cabecalho comodo-toggle" onclick="toggleComodoFicha('${idComodo}')">
        <div class="comodo-cabecalho-left">
          <h3 class="comodo-nome">${escaparHTML(comodo.nome)}</h3>
          ${area ? `<span class="comodo-area-badge">${area} m²</span>` : ''}
        </div>
        <span class="comodo-arrow-ficha ${aberto ? 'aberto' : ''}" id="arrow-${idComodo}">▾</span>
      </div>
      <div class="comodo-grupos" id="${idComodo}" style="display:${aberto ? 'block' : 'none'}">
        ${gruposHTML}
      </div>
    </div>`;
}

/**
 * Abre/fecha um cômodo accordion na ficha do portal.
 * @param {string} idComodo
 */
function toggleComodoFicha(idComodo) {
  const corpo = document.getElementById(idComodo);
  const arrow = document.getElementById('arrow-' + idComodo);
  if (!corpo) return;
  const aberto = corpo.style.display !== 'none';
  corpo.style.display = aberto ? 'none' : 'block';
  arrow?.classList.toggle('aberto', !aberto);
}

/**
 * Inicializa todos os accordions após renderizar a ficha.
 * Necessário porque o HTML é injetado via innerHTML.
 */
function inicializarAccordionsFicha() {
  // Nada adicional necessário — estado inicial definido inline no HTML gerado
}

/* ================================================================
   HELPERS DE RENDERIZAÇÃO
   ================================================================ */

function renderAtributo(chave, valor) {
  let valorFormatado = valor;
  if (valor === 'Sim') {
    valorFormatado = '<span style="color:var(--verde);font-weight:700;">✓ Sim</span>';
  } else if (valor === 'Não' || valor === 'Nao') {
    valorFormatado = '<span style="color:var(--texto-fraco);">✗ Não</span>';
  }
  return `
    <div class="atributo">
      <span class="atributo-chave">${escaparHTML(chave)}</span>
      <span class="atributo-valor">${valorFormatado}</span>
    </div>`;
}

function escaparHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
