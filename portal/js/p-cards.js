/* arquivo: p-cards.js | versao: 0.4.0 */
/* ============================================================
   p-cards.js — Renderização dos cards de imóveis (portal/index.html)
   Depende de: p-ui.js (formatarData, formatarEndereco)
   ============================================================ */

function renderizarCards(imoveis) {
  const grid          = document.getElementById('grid-imoveis');
  const vazio         = document.getElementById('estado-vazio');
  const semResultados = document.getElementById('estado-sem-resultados');
  const contagem      = document.getElementById('contagem');

  grid.innerHTML = '';

  const totalGeral = typeof _todosImoveis !== 'undefined' ? _todosImoveis.length : null;
  const hayImoveis = totalGeral === null ? (imoveis?.length > 0) : (totalGeral > 0);

  if (!hayImoveis) {
    if (vazio)         vazio.style.display        = 'flex';
    if (semResultados) semResultados.style.display = 'none';
    grid.style.display = 'none';
    if (contagem) contagem.textContent = '0 imóveis';
    return;
  }

  if (!imoveis || imoveis.length === 0) {
    if (vazio)         vazio.style.display        = 'none';
    if (semResultados) semResultados.style.display = 'flex';
    grid.style.display = 'none';
    if (contagem) contagem.textContent = `${totalGeral} imóvel${totalGeral !== 1 ? 's' : ''}`;
    return;
  }

  if (vazio)         vazio.style.display        = 'none';
  if (semResultados) semResultados.style.display = 'none';
  grid.style.display = 'grid';

  if (contagem) {
    contagem.textContent = `${totalGeral ?? imoveis.length} imóvel${(totalGeral ?? imoveis.length) !== 1 ? 's' : ''}`;
  }

  for (const imovel of imoveis) {
    grid.appendChild(criarCard(imovel));
  }
}

function criarCard(imovel) {
  const loc = imovel.localizacao || {};
  const cad = imovel.cadastrante || {};

  const endereco   = formatarEndereco(loc);
  const cidade     = [loc['Cidade'], loc['Estado']].filter(Boolean).join(', ');
  const cep        = loc['CEP'] || '';
  const qtdComodos = imovel.comodos ? imovel.comodos.length : 0;
  const tipoCad    = cad['Tipo'] || 'Anunciante';
  /* Tipo de imóvel — adicionado v0.3.0 */
  const tipoImovel = loc['Tipo de Imóvel'] || loc['Tipo de Imovel'] || '';

  const card = document.createElement('article');
  card.className = 'card-imovel';
  card.setAttribute('data-id', imovel.id);
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Ver ficha: ${endereco}`);

  const metaTags = [
    tipoImovel  ? `<span class="meta-tag meta-tag-tipo">${tipoImovel}</span>` : '',
    qtdComodos > 0 ? `<span class="meta-tag">🚪 ${qtdComodos} cômodo${qtdComodos !== 1 ? 's' : ''}</span>` : '',
    `<span class="meta-tag">${tipoCad}</span>`
  ].filter(Boolean).join('');

  card.innerHTML = `
    <div class="card-foto">
      <div class="card-foto-placeholder">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 50 L8 28 L32 10 L56 28 L56 50 Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" fill="none"/>
          <rect x="22" y="36" width="20" height="14" stroke="currentColor" stroke-width="2" fill="none"/>
          <rect x="13" y="27" width="12" height="11" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <rect x="39" y="27" width="12" height="11" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
        <span>Sem foto</span>
      </div>
      ${cep ? `<div class="card-badge">CEP ${cep}</div>` : ''}
    </div>
    <div class="card-corpo">
      <div class="card-endereco" title="${endereco}">${endereco || 'Endereço não informado'}</div>
      <div class="card-cidade">${cidade || '—'}</div>
      <div class="card-meta">${metaTags}</div>
      <div class="card-footer">
        <span class="card-data">Importado ${formatarData(imovel.importadoEm)}</span>
        <button class="btn-ver" data-id="${imovel.id}" onclick="navegarParaImovel(event)">
          Ver ficha →
        </button>
      </div>
    </div>`;

  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-ver')) return;
    window.location.href = `imovel.html?id=${encodeURIComponent(imovel.id)}`;
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = `imovel.html?id=${encodeURIComponent(imovel.id)}`;
    }
  });

  return card;
}

function navegarParaImovel(evento) {
  evento.stopPropagation();
  const id = evento.currentTarget.getAttribute('data-id');
  if (id) window.location.href = `imovel.html?id=${encodeURIComponent(id)}`;
}
