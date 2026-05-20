/* ============================================================
   ficha.js — Renderização da ficha técnica completa (imovel.html)
   Depende de: ui.js (formatarData, formatarEndereco)
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
      </div>
    `;
    return;
  }

  const loc = imovel.localizacao  || {};
  const cad = imovel.cadastrante  || {};
  const endereco = formatarEndereco(loc);

  /* ---- Cabeçalho da página ---- */
  document.title = `${endereco} — Zillow BR`;

  /* ---- Monta o HTML completo ---- */
  let html = `
    <!-- Cabeçalho da ficha -->
    <header class="ficha-cabecalho">
      <h1 class="ficha-titulo">${loc['Rua'] || 'Imóvel'}, ${loc['Número'] || loc['Numero'] || ''}</h1>
      <p class="ficha-subtitulo">
        ${loc['Cidade'] || ''}${loc['Estado'] ? ', ' + loc['Estado'] : ''}
        ${loc['CEP'] ? '&nbsp;·&nbsp; CEP ' + loc['CEP'] : ''}
      </p>
      ${loc['Complemento'] ? `<p class="ficha-complemento">${loc['Complemento']}</p>` : ''}
      <span class="ficha-importado">
        📅 Importado em ${formatarData(imovel.importadoEm, 'longo')}
      </span>
    </header>
  `;

  /* ---- Seção: Localização ---- */
  if (Object.keys(loc).length > 0) {
    html += `
      <section class="ficha-secao">
        <h2 class="ficha-secao-titulo">📍 Localização</h2>
        <div class="ficha-grid-atributos">
          ${Object.entries(loc).map(([k, v]) => renderAtributo(k, v)).join('')}
        </div>
      </section>
    `;
  }

  /* ---- Seção: Cadastrante ---- */
  if (Object.keys(cad).length > 0) {
    html += `
      <section class="ficha-secao">
        <h2 class="ficha-secao-titulo">👤 Cadastrante</h2>
        <div class="ficha-grid-atributos">
          ${Object.entries(cad).map(([k, v]) => renderAtributo(k, v)).join('')}
        </div>
      </section>
    `;
  }

  /* ---- Seção: Cômodos ---- */
  if (imovel.comodos && imovel.comodos.length > 0) {
    html += `
      <section class="ficha-secao">
        <h2 class="ficha-secao-titulo">🏠 Cômodos (${imovel.comodos.length})</h2>
        <div class="comodos-lista">
          ${imovel.comodos.map(c => renderComodo(c)).join('')}
        </div>
      </section>
    `;
  }

  container.innerHTML = html;
}

/* ----------------------------------------------------------------
   Funções auxiliares de renderização
   ---------------------------------------------------------------- */

/**
 * Gera o HTML de um par chave/valor (atributo).
 * Destaca visualmente valores "Sim" / "Não".
 * @param {string} chave
 * @param {string} valor
 * @returns {string}
 */
function renderAtributo(chave, valor) {
  // Destaque semântico para Sim/Não
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
    </div>
  `;
}

/**
 * Gera o HTML completo de um cômodo (card com grupos de atributos).
 * @param {Object} comodo — { nome, grupos: [{ nome, itens: [{caracteristica, valor}] }] }
 * @returns {string}
 */
function renderComodo(comodo) {
  const gruposHTML = comodo.grupos.map(grupo => `
    <div class="grupo-bloco">
      <h4 class="grupo-titulo">${escaparHTML(grupo.nome)}</h4>
      <div class="ficha-grid-atributos">
        ${grupo.itens.map(item => renderAtributo(item.caracteristica, item.valor)).join('')}
      </div>
    </div>
  `).join('');

  return `
    <div class="comodo-card">
      <div class="comodo-cabecalho">
        <h3 class="comodo-nome">${escaparHTML(comodo.nome)}</h3>
      </div>
      <div class="comodo-grupos">
        ${gruposHTML}
      </div>
    </div>
  `;
}

/**
 * Escapa caracteres HTML para evitar XSS ao injetar strings no DOM.
 * @param {string} str
 * @returns {string}
 */
function escaparHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
