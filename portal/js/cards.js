/* ============================================================
   cards.js — Renderização dos cards de imóveis (página index)
   Depende de: ui.js (formatarData, formatarEndereco)
   ============================================================ */

/**
 * Renderiza toda a grade de cards.
 * Alterna entre o estado vazio e o grid, conforme a lista.
 * @param {Array<Object>} imoveis
 */
function renderizarCards(imoveis) {
  const grid   = document.getElementById('grid-imoveis');
  const vazio  = document.getElementById('estado-vazio');
  const contagem = document.getElementById('contagem');

  // Limpa o grid antes de re-renderizar
  grid.innerHTML = '';

  if (!imoveis || imoveis.length === 0) {
    vazio.style.display = 'flex';
    grid.style.display  = 'none';
    if (contagem) contagem.textContent = '0 imóveis';
    return;
  }

  vazio.style.display = 'none';
  grid.style.display  = 'grid';

  // Atualiza contador
  if (contagem) {
    contagem.textContent = `${imoveis.length} imóvel${imoveis.length !== 1 ? 's' : ''}`;
  }

  // Cria e insere um card para cada imóvel
  for (const imovel of imoveis) {
    grid.appendChild(criarCard(imovel));
  }
}

/**
 * Cria o elemento DOM de um card individual.
 * @param {Object} imovel
 * @returns {HTMLElement}
 */
function criarCard(imovel) {
  const loc    = imovel.localizacao  || {};
  const cad    = imovel.cadastrante  || {};

  const endereco   = formatarEndereco(loc);
  const cidade     = [loc['Cidade'], loc['Estado']].filter(Boolean).join(', ');
  const cep        = loc['CEP'] || '';
  const qtdComodos = imovel.comodos ? imovel.comodos.length : 0;
  const tipoCad    = cad['Tipo'] || 'Cadastrante';

  const card = document.createElement('article');
  card.className = 'card-imovel';
  card.setAttribute('data-id', imovel.id);
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Ver ficha: ${endereco}`);

  card.innerHTML = `
    <!-- Área da foto (placeholder por enquanto) -->
    <div class="card-foto">
      <div class="card-foto-placeholder">
        <!-- Ícone de casa SVG inline -->
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 50 L8 28 L32 10 L56 28 L56 50 Z"
                stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" fill="none"/>
          <rect x="22" y="36" width="20" height="14"
                stroke="currentColor" stroke-width="2" fill="none"/>
          <rect x="13" y="27" width="12" height="11"
                stroke="currentColor" stroke-width="1.5" fill="none"/>
          <rect x="39" y="27" width="12" height="11"
                stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
        <span>Sem foto</span>
      </div>
      ${cep ? `<div class="card-badge">CEP ${cep}</div>` : ''}
    </div>

    <!-- Informações do imóvel -->
    <div class="card-corpo">
      <div class="card-endereco" title="${endereco}">${endereco || 'Endereço não informado'}</div>
      <div class="card-cidade">${cidade || '—'}</div>

      <div class="card-meta">
        ${qtdComodos > 0
          ? `<span class="meta-tag">🚪 ${qtdComodos} cômodo${qtdComodos !== 1 ? 's' : ''}</span>`
          : ''}
        <span class="meta-tag">${tipoCad}</span>
      </div>

      <div class="card-footer">
        <span class="card-data">Importado ${formatarData(imovel.importadoEm)}</span>
        <button class="btn-ver" data-id="${imovel.id}" onclick="navegarParaImovel(event)">
          Ver ficha →
        </button>
      </div>
    </div>
  `;

  // Clique no card inteiro (exceto no botão, que tem seu próprio handler)
  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-ver')) return; // botão cuida de si
    window.location.href = `imovel.html?id=${encodeURIComponent(imovel.id)}`;
  });

  // Acessibilidade: Enter/Space ativa o card
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = `imovel.html?id=${encodeURIComponent(imovel.id)}`;
    }
  });

  return card;
}

/**
 * Handler do botão "Ver ficha →" dentro do card.
 * Usa data-id para navegar sem depender de closure da função criarCard.
 * @param {MouseEvent} evento
 */
function navegarParaImovel(evento) {
  evento.stopPropagation(); // impede disparo duplo com o listener do card
  const id = evento.currentTarget.getAttribute('data-id');
  if (id) {
    window.location.href = `imovel.html?id=${encodeURIComponent(id)}`;
  }
}
