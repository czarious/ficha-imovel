/* arquivo: p-render.js | versao: 0.4.0 */
/* ============================================================
   p-render.js — Renderização da ficha técnica completa (portal/p-imovel.html)
   Depende de: p-ui.js (formatarData, formatarEndereco)
   ============================================================ */

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
  const cad = imovel.cadastrante || {};
  const endereco = formatarEndereco(loc);
  document.title = `${endereco} — Zillow BR`;

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

  /* Seção Destaques — badges automáticos dos atributos = Sim */
  if (imovel.comodos && imovel.comodos.length > 0) {
    const destaquesHTML = renderDestaques(imovel.comodos);
    if (destaquesHTML) html += destaquesHTML;
  }

  /* Tabela resumo de cômodos */
  if (imovel.comodos && imovel.comodos.length > 0) {
    html += renderTabelaResumo(imovel.comodos);
  }

  /* Localização — aberta por padrão */
  if (Object.keys(loc).length > 0) {
    html += renderSecaoAccordion('localizacao', '📍 Localização',
      `<div class="ficha-grid-atributos">
        ${Object.entries(loc).map(([k, v]) => renderAtributo(k, v)).join('')}
      </div>`, true);
  }

  /* Anunciante — fechada por padrão */
  if (Object.keys(cad).length > 0) {
    html += renderSecaoAccordion('cadastrante', '👤 Anunciante',
      `<div class="ficha-grid-atributos">
        ${Object.entries(cad).map(([k, v]) => renderAtributo(k, v)).join('')}
      </div>`, false);
  }

  /* Cômodos colapsáveis */
  if (imovel.comodos && imovel.comodos.length > 0) {
    const comodosHTML = imovel.comodos.map((c, idx) => renderComodoAccordion(c, idx)).join('');
    html += `
      <section class="ficha-secao">
        <h2 class="ficha-secao-titulo">🏠 Detalhamento por cômodo</h2>
        <div class="comodos-lista">${comodosHTML}</div>
      </section>`;
  }

  container.innerHTML = html;
}

/* ================================================================
   SEÇÃO DESTAQUES
   Extrai automaticamente todos os atributos com valor = Sim
   e exibe como badges visuais no topo da ficha
   ================================================================ */
function renderDestaques(comodos) {
  const destaques = [];

  for (const comodo of comodos) {
    for (const grupo of (comodo.grupos || [])) {
      for (const item of (grupo.itens || [])) {
        if (item.valor === 'Sim') {
          /* Evita duplicatas */
          const chave = item.caracteristica.toLowerCase();
          if (!destaques.find(d => d.chave === chave)) {
            destaques.push({ chave, label: item.caracteristica });
          }
        }
      }
    }
  }

  if (destaques.length === 0) return '';

  const badges = destaques.map(d => `
    <span class="destaque-badge">✓ ${escaparHTML(d.label)}</span>
  `).join('');

  return `
    <section class="ficha-destaques-wrap">
      <h2 class="ficha-destaques-titulo">✨ Destaques</h2>
      <div class="ficha-destaques-lista">${badges}</div>
    </section>`;
}

/* ================================================================
   TABELA RESUMO
   ================================================================ */
function renderTabelaResumo(comodos) {
  const linhas = comodos.map(c => {
    const area = extrairArea(c);
    return `
      <tr class="resumo-linha">
        <td class="resumo-nome">${escaparHTML(c.nome)}</td>
        <td class="resumo-area">${area ? area + ' m²' : '—'}</td>
      </tr>`;
  }).join('');

  const areaTotal = comodos.reduce((soma, c) => soma + (parseFloat(extrairArea(c)) || 0), 0);
  const totalHTML = areaTotal > 0 ? `
    <tr class="resumo-total">
      <td>Área total dos cômodos</td>
      <td>${areaTotal.toFixed(2)} m²</td>
    </tr>` : '';

  return `
    <section class="ficha-resumo-wrap">
      <h2 class="ficha-resumo-titulo">Resumo</h2>
      <table class="ficha-resumo-tabela">
        <thead><tr><th>Cômodo</th><th>Metragem</th></tr></thead>
        <tbody>${linhas}${totalHTML}</tbody>
      </table>
    </section>`;
}

function extrairArea(comodo) {
  for (const grupo of (comodo.grupos || [])) {
    for (const item of (grupo.itens || [])) {
      if (item.caracteristica === 'Área total (m²)' || item.caracteristica === 'Area total (m2)') {
        return item.valor || null;
      }
    }
  }
  return null;
}

/* ================================================================
   ACCORDION DE SEÇÃO
   ================================================================ */
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
function renderComodoAccordion(comodo, idx) {
  const aberto   = idx === 0;
  const area     = extrairArea(comodo);
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

function toggleComodoFicha(idComodo) {
  const corpo = document.getElementById(idComodo);
  const arrow = document.getElementById('arrow-' + idComodo);
  if (!corpo) return;
  const aberto = corpo.style.display !== 'none';
  corpo.style.display = aberto ? 'none' : 'block';
  arrow?.classList.toggle('aberto', !aberto);
}

/* ================================================================
   HELPERS
   ================================================================ */
function renderAtributo(chave, valor) {
  let valorFormatado = valor;
  if (valor === 'Sim') valorFormatado = '<span style="color:var(--verde);font-weight:700;">✓ Sim</span>';
  else if (valor === 'Não' || valor === 'Nao') valorFormatado = '<span style="color:var(--texto-fraco);">✗ Não</span>';
  return `
    <div class="atributo">
      <span class="atributo-chave">${escaparHTML(chave)}</span>
      <span class="atributo-valor">${valorFormatado}</span>
    </div>`;
}

function escaparHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
