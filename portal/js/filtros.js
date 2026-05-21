/* ============================================================
   filtros.js — Filtragem, busca e ordenação de imóveis
   Depende de: cards.js (renderizarCards), ui.js (formatarEndereco)
   ============================================================ */

// Cache da lista completa — separado da lista filtrada exibida
let _todosImoveis = [];

/* ================================================================
   INICIALIZAÇÃO
   ================================================================ */

/**
 * Inicializa o sistema de filtros com a lista de imóveis.
 * Chamado na DOMContentLoaded e sempre que a lista mudar (importação/exclusão).
 * @param {Array<Object>} imoveis
 */
function inicializarFiltros(imoveis) {
  _todosImoveis = imoveis;
  popularDropdowns(imoveis);
  registrarEventos();
  aplicarFiltros(); // renderiza com estado inicial (sem filtros)
}

/**
 * Atualiza o cache e os dropdowns após importação ou exclusão.
 * Não re-registra eventos — só atualiza dados.
 * @param {Array<Object>} imoveis
 */
function atualizarCacheFiltros(imoveis) {
  _todosImoveis = imoveis;
  popularDropdowns(imoveis);
  aplicarFiltros();
}

/* ================================================================
   DROPDOWNS DINÂMICOS
   ================================================================ */

/**
 * Popula os selects de Estado, Cidade e Tipo de cadastrante
 * com os valores únicos presentes nos imóveis cadastrados.
 * @param {Array<Object>} imoveis
 */
function popularDropdowns(imoveis) {
  const estados      = extrairUnicos(imoveis, i => i.localizacao?.['Estado']);
  const cidades      = extrairUnicos(imoveis, i => i.localizacao?.['Cidade']);
  const cadastrantes = extrairUnicos(imoveis, i => i.cadastrante?.['Tipo']);
  /* Tipo de imóvel — campo adicionado na ficha v0.3.0 */
  const tiposImovel  = extrairUnicos(imoveis, i =>
    i.localizacao?.['Tipo de Imóvel'] || i.localizacao?.['Tipo de Imovel']
  );

  preencherSelect('filtro-estado',       estados,      'Todos os estados');
  preencherSelect('filtro-cidade',       cidades,      'Todas as cidades');
  preencherSelect('filtro-cadastrante',  cadastrantes, 'Todos');
  preencherSelect('filtro-tipo-imovel',  tiposImovel,  'Todos os tipos');
}

/**
 * Atualiza as opções de cidade com base no estado selecionado.
 * Chamado quando o select de estado muda.
 * @param {string} estadoSelecionado — vazio = todos
 */
function atualizarCidadesPorEstado(estadoSelecionado) {
  const imovelsFiltrados = estadoSelecionado
    ? _todosImoveis.filter(i => i.localizacao?.['Estado'] === estadoSelecionado)
    : _todosImoveis;

  const cidades = extrairUnicos(imovelsFiltrados, i => i.localizacao?.['Cidade']);
  preencherSelect('filtro-cidade', cidades, 'Todas as cidades');
}

/**
 * Extrai valores únicos e ordenados de uma lista de imóveis.
 * @param {Array<Object>} imoveis
 * @param {Function} extrator — função que recebe um imóvel e retorna o valor
 * @returns {Array<string>}
 */
function extrairUnicos(imoveis, extrator) {
  return [...new Set(imoveis.map(extrator).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
  );
}

/**
 * Preenche um <select> preservando a opção "todos" no topo.
 * @param {string} idSelect
 * @param {Array<string>} valores
 * @param {string} labelTodos — texto da opção "todos"
 */
function preencherSelect(idSelect, valores, labelTodos) {
  const sel = document.getElementById(idSelect);
  if (!sel) return;

  // Guarda valor atual para reselecionar depois se ainda válido
  const valorAtual = sel.value;

  sel.innerHTML = `<option value="">${labelTodos}</option>`;
  valores.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    sel.appendChild(opt);
  });

  // Reseleciona o valor anterior se ainda existir nas novas opções
  if (valorAtual && valores.includes(valorAtual)) {
    sel.value = valorAtual;
  }
}

/* ================================================================
   REGISTRO DE EVENTOS
   Chamado apenas uma vez na inicialização — sem risco de duplicata
   porque o HTML já existe antes de qualquer importação.
   ================================================================ */

let _eventosRegistrados = false;

function registrarEventos() {
  if (_eventosRegistrados) return;
  _eventosRegistrados = true;

  // Busca livre — dispara ao digitar
  const inputBusca = document.getElementById('filtro-busca');
  if (inputBusca) {
    inputBusca.addEventListener('input', () => {
      sincronizarBotaoLimparBusca();
      aplicarFiltros();
    });
  }

  // Botão ✕ da busca
  const btnLimparBusca = document.getElementById('btn-limpar-busca');
  if (btnLimparBusca) {
    btnLimparBusca.addEventListener('click', () => {
      document.getElementById('filtro-busca').value = '';
      sincronizarBotaoLimparBusca();
      aplicarFiltros();
      document.getElementById('filtro-busca').focus();
    });
  }

  // Toggle do painel avançado
  const btnToggle = document.getElementById('btn-toggle-filtros');
  if (btnToggle) btnToggle.addEventListener('click', togglePainelFiltros);

  // Estado → atualiza cidades e re-filtra
  const selEstado = document.getElementById('filtro-estado');
  if (selEstado) {
    selEstado.addEventListener('change', () => {
      atualizarCidadesPorEstado(selEstado.value);
      aplicarFiltros();
    });
  }

  // Demais selects do painel
  ['filtro-cidade', 'filtro-comodos', 'filtro-cadastrante', 'filtro-tipo-imovel', 'filtro-ordenar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', aplicarFiltros);
  });

  // Botão limpar todos os filtros
  const btnLimpar = document.getElementById('btn-limpar-filtros');
  if (btnLimpar) btnLimpar.addEventListener('click', limparTodosFiltros);
}

/* ================================================================
   APLICAÇÃO DOS FILTROS
   ================================================================ */

/**
 * Lê todos os controles de filtro, filtra _todosImoveis,
 * ordena e chama renderizarCards com o resultado.
 */
function aplicarFiltros() {
  let resultado = [..._todosImoveis];

  // Lê valores dos controles
  const busca       = (document.getElementById('filtro-busca')?.value       || '').toLowerCase().trim();
  const estado      = document.getElementById('filtro-estado')?.value       || '';
  const cidade      = document.getElementById('filtro-cidade')?.value       || '';
  const comodos     = parseInt(document.getElementById('filtro-comodos')?.value  || '0');
  const cadastrante = document.getElementById('filtro-cadastrante')?.value   || '';
  const tipoImovel  = document.getElementById('filtro-tipo-imovel')?.value   || '';
  const ordenar     = document.getElementById('filtro-ordenar')?.value       || 'recente';

  /* ---- Busca livre ---- */
  if (busca) {
    resultado = resultado.filter(i => {
      const loc = i.localizacao || {};
      // Concatena todos os campos de localização para busca
      const campos = [
        loc['Rua'], loc['CEP'], loc['Cidade'], loc['Estado'],
        loc['Número'] || loc['Numero'], loc['Complemento'], loc['País'] || loc['Pais']
      ].filter(Boolean).join(' ').toLowerCase();
      return campos.includes(busca);
    });
  }

  /* ---- Filtros de dropdown ---- */
  if (estado)      resultado = resultado.filter(i => i.localizacao?.['Estado'] === estado);
  if (cidade)      resultado = resultado.filter(i => i.localizacao?.['Cidade'] === cidade);
  if (comodos > 0) resultado = resultado.filter(i => (i.comodos?.length || 0) >= comodos);
  if (cadastrante) resultado = resultado.filter(i => i.cadastrante?.['Tipo'] === cadastrante);
  if (tipoImovel)  resultado = resultado.filter(i =>
    (i.localizacao?.['Tipo de Imóvel'] || i.localizacao?.['Tipo de Imovel']) === tipoImovel
  );

  /* ---- Ordenação ---- */
  resultado.sort((a, b) => {
    switch (ordenar) {
      case 'antigo':
        return new Date(a.importadoEm) - new Date(b.importadoEm);
      case 'cidade-az':
        return (a.localizacao?.['Cidade'] || '').localeCompare(
          b.localizacao?.['Cidade'] || '', 'pt-BR', { sensitivity: 'base' });
      case 'cidade-za':
        return (b.localizacao?.['Cidade'] || '').localeCompare(
          a.localizacao?.['Cidade'] || '', 'pt-BR', { sensitivity: 'base' });
      default: // 'recente'
        return new Date(b.importadoEm) - new Date(a.importadoEm);
    }
  });

  /* ---- Atualiza UI de estado dos filtros ---- */
  atualizarBadgeFiltros();
  atualizarContagemResultados(resultado.length, _todosImoveis.length);

  /* ---- Re-renderiza cards ---- */
  renderizarCards(resultado);
}

/* ================================================================
   CONTROLES DO PAINEL
   ================================================================ */

/**
 * Abre/fecha o painel de filtros avançados com animação.
 */
function togglePainelFiltros() {
  const painel = document.getElementById('painel-filtros');
  const btn    = document.getElementById('btn-toggle-filtros');
  if (!painel) return;

  const aberto = painel.classList.contains('aberto');

  if (aberto) {
    painel.classList.remove('aberto');
    painel.style.maxHeight = '0';
    btn?.classList.remove('ativo');
  } else {
    painel.classList.add('aberto');
    painel.style.maxHeight = painel.scrollHeight + 'px';
    btn?.classList.add('ativo');
  }
}

/**
 * Reseta todos os controles de filtro para o estado inicial.
 */
function limparTodosFiltros() {
  const campos = ['filtro-busca', 'filtro-estado', 'filtro-cidade', 'filtro-cadastrante', 'filtro-tipo-imovel'];
  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  const selComodos = document.getElementById('filtro-comodos');
  if (selComodos) selComodos.value = '0';

  const selOrdenar = document.getElementById('filtro-ordenar');
  if (selOrdenar) selOrdenar.value = 'recente';

  // Restaura todas as cidades (remove filtro por estado)
  atualizarCidadesPorEstado('');
  sincronizarBotaoLimparBusca();
  aplicarFiltros();
}

/* ================================================================
   HELPERS DE UI
   ================================================================ */

/** Mostra/oculta o ✕ da busca conforme o campo tem conteúdo. */
function sincronizarBotaoLimparBusca() {
  const btn   = document.getElementById('btn-limpar-busca');
  const busca = document.getElementById('filtro-busca');
  if (btn && busca) {
    btn.style.display = busca.value ? 'flex' : 'none';
  }
}

/**
 * Atualiza o badge com o número de filtros ativos no botão "Filtros".
 */
function atualizarBadgeFiltros() {
  const badge = document.getElementById('badge-filtros');
  if (!badge) return;

  let count = 0;
  if (document.getElementById('filtro-busca')?.value)              count++;
  if (document.getElementById('filtro-estado')?.value)             count++;
  if (document.getElementById('filtro-cidade')?.value)             count++;
  if ((parseInt(document.getElementById('filtro-comodos')?.value) || 0) > 0) count++;
  if (document.getElementById('filtro-cadastrante')?.value)        count++;
  if (document.getElementById('filtro-tipo-imovel')?.value)        count++;

  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-flex' : 'none';

  // Realça o botão quando há filtros ativos
  const btn = document.getElementById('btn-toggle-filtros');
  if (btn) btn.classList.toggle('tem-filtros', count > 0);
}

/**
 * Atualiza o texto de contagem de resultados no rodapé do painel.
 * @param {number} encontrados
 * @param {number} total
 */
function atualizarContagemResultados(encontrados, total) {
  const el = document.getElementById('resultado-contagem');
  if (!el) return;

  if (encontrados === total) {
    el.textContent = `${total} imóvel${total !== 1 ? 's' : ''} cadastrado${total !== 1 ? 's' : ''}`;
  } else {
    el.textContent = `${encontrados} de ${total} imóvel${total !== 1 ? 's' : ''} encontrado${encontrados !== 1 ? 's' : ''}`;
  }
}
