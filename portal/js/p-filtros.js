/* arquivo: p-filtros.js | versao: 0.4.0 */
/* ============================================================
   p-filtros.js — Filtragem, busca e ordenação de imóveis
   Depende de: p-cards.js (renderizarCards), p-ui.js (formatarEndereco)
   ============================================================ */

let _todosImoveis = [];

/* ================================================================
   INICIALIZAÇÃO
   ================================================================ */
function inicializarFiltros(imoveis) {
  _todosImoveis = imoveis;
  popularDropdowns(imoveis);
  registrarEventos();
  aplicarFiltros();
}

function atualizarCacheFiltros(imoveis) {
  _todosImoveis = imoveis;
  popularDropdowns(imoveis);
  aplicarFiltros();
}

/* ================================================================
   DROPDOWNS DINÂMICOS
   ================================================================ */
function popularDropdowns(imoveis) {
  const estados     = extrairUnicos(imoveis, i => i.localizacao?.['Estado']);
  const cidades     = extrairUnicos(imoveis, i => i.localizacao?.['Cidade']);
  const anunciantes = extrairUnicos(imoveis, i => i.anunciante?.['Tipo']);
  /* Tipo de imóvel — adicionado v0.3.0 */
  const tiposImovel = extrairUnicos(imoveis, i =>
    i.localizacao?.['Tipo de Imóvel'] || i.localizacao?.['Tipo de Imovel']
  );

  preencherSelect('filtro-estado',      estados,      'Todos os estados');
  preencherSelect('filtro-cidade',      cidades,      'Todas as cidades');
  preencherSelect('filtro-anunciante', anunciantes, 'Todos');
  preencherSelect('filtro-tipo-imovel', tiposImovel,  'Todos os tipos');
}

function atualizarCidadesPorEstado(estadoSelecionado) {
  const filtrados = estadoSelecionado
    ? _todosImoveis.filter(i => i.localizacao?.['Estado'] === estadoSelecionado)
    : _todosImoveis;
  const cidades = extrairUnicos(filtrados, i => i.localizacao?.['Cidade']);
  preencherSelect('filtro-cidade', cidades, 'Todas as cidades');
}

function extrairUnicos(imoveis, extrator) {
  return [...new Set(imoveis.map(extrator).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
  );
}

function preencherSelect(idSelect, valores, labelTodos) {
  const sel = document.getElementById(idSelect);
  if (!sel) return;
  const valorAtual = sel.value;
  sel.innerHTML = `<option value="">${labelTodos}</option>`;
  valores.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v; opt.textContent = v;
    sel.appendChild(opt);
  });
  if (valorAtual && valores.includes(valorAtual)) sel.value = valorAtual;
}

/* ================================================================
   REGISTRO DE EVENTOS
   ================================================================ */
let _eventosRegistrados = false;

function registrarEventos() {
  if (_eventosRegistrados) return;
  _eventosRegistrados = true;

  const inputBusca = document.getElementById('filtro-busca');
  if (inputBusca) inputBusca.addEventListener('input', () => {
    sincronizarBotaoLimparBusca();
    aplicarFiltros();
  });

  const btnLimparBusca = document.getElementById('btn-limpar-busca');
  if (btnLimparBusca) btnLimparBusca.addEventListener('click', () => {
    document.getElementById('filtro-busca').value = '';
    sincronizarBotaoLimparBusca();
    aplicarFiltros();
    document.getElementById('filtro-busca').focus();
  });

  const btnToggle = document.getElementById('btn-toggle-filtros');
  if (btnToggle) btnToggle.addEventListener('click', togglePainelFiltros);

  const selEstado = document.getElementById('filtro-estado');
  if (selEstado) selEstado.addEventListener('change', () => {
    atualizarCidadesPorEstado(selEstado.value);
    aplicarFiltros();
  });

  ['filtro-cidade', 'filtro-comodos', 'filtro-anunciante', 'filtro-tipo-imovel', 'filtro-ordenar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', aplicarFiltros);
  });

  const btnLimpar = document.getElementById('btn-limpar-filtros');
  if (btnLimpar) btnLimpar.addEventListener('click', limparTodosFiltros);
}

/* ================================================================
   APLICAÇÃO DOS FILTROS
   ================================================================ */
function aplicarFiltros() {
  let resultado = [..._todosImoveis];

  const busca      = (document.getElementById('filtro-busca')?.value      || '').toLowerCase().trim();
  const estado     = document.getElementById('filtro-estado')?.value      || '';
  const cidade     = document.getElementById('filtro-cidade')?.value      || '';
  const comodos    = parseInt(document.getElementById('filtro-comodos')?.value || '0');
  const anunciante = document.getElementById('filtro-anunciante')?.value || '';
  const tipoImovel = document.getElementById('filtro-tipo-imovel')?.value  || '';
  const ordenar    = document.getElementById('filtro-ordenar')?.value      || 'recente';

  if (busca) {
    resultado = resultado.filter(i => {
      const loc = i.localizacao || {};
      const campos = [
        loc['Rua'], loc['CEP'], loc['Cidade'], loc['Estado'],
        loc['Número'] || loc['Numero'], loc['Complemento'], loc['País'] || loc['Pais']
      ].filter(Boolean).join(' ').toLowerCase();
      return campos.includes(busca);
    });
  }

  if (estado)      resultado = resultado.filter(i => i.localizacao?.['Estado'] === estado);
  if (cidade)      resultado = resultado.filter(i => i.localizacao?.['Cidade'] === cidade);
  if (comodos > 0) resultado = resultado.filter(i => (i.comodos?.length || 0) >= comodos);
  if (anunciante) resultado = resultado.filter(i => i.anunciante?.['Tipo'] === anunciante);
  if (tipoImovel)  resultado = resultado.filter(i =>
    (i.localizacao?.['Tipo de Imóvel'] || i.localizacao?.['Tipo de Imovel']) === tipoImovel
  );

  resultado.sort((a, b) => {
    switch (ordenar) {
      case 'antigo':    return new Date(a.importadoEm) - new Date(b.importadoEm);
      case 'cidade-az': return (a.localizacao?.['Cidade'] || '').localeCompare(b.localizacao?.['Cidade'] || '', 'pt-BR', { sensitivity: 'base' });
      case 'cidade-za': return (b.localizacao?.['Cidade'] || '').localeCompare(a.localizacao?.['Cidade'] || '', 'pt-BR', { sensitivity: 'base' });
      default:          return new Date(b.importadoEm) - new Date(a.importadoEm);
    }
  });

  atualizarBadgeFiltros();
  atualizarContagemResultados(resultado.length, _todosImoveis.length);
  renderizarCards(resultado);
}

/* ================================================================
   CONTROLES DO PAINEL
   ================================================================ */
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

function limparTodosFiltros() {
  ['filtro-busca', 'filtro-estado', 'filtro-cidade', 'filtro-anunciante', 'filtro-tipo-imovel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const selComodos = document.getElementById('filtro-comodos');
  if (selComodos) selComodos.value = '0';
  const selOrdenar = document.getElementById('filtro-ordenar');
  if (selOrdenar) selOrdenar.value = 'recente';
  atualizarCidadesPorEstado('');
  sincronizarBotaoLimparBusca();
  aplicarFiltros();
}

/* ================================================================
   HELPERS DE UI
   ================================================================ */
function sincronizarBotaoLimparBusca() {
  const btn   = document.getElementById('btn-limpar-busca');
  const busca = document.getElementById('filtro-busca');
  if (btn && busca) btn.style.display = busca.value ? 'flex' : 'none';
}

function atualizarBadgeFiltros() {
  const badge = document.getElementById('badge-filtros');
  if (!badge) return;
  let count = 0;
  if (document.getElementById('filtro-busca')?.value)              count++;
  if (document.getElementById('filtro-estado')?.value)             count++;
  if (document.getElementById('filtro-cidade')?.value)             count++;
  if ((parseInt(document.getElementById('filtro-comodos')?.value) || 0) > 0) count++;
  if (document.getElementById('filtro-anunciante')?.value)        count++;
  if (document.getElementById('filtro-tipo-imovel')?.value)        count++;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-flex' : 'none';
  const btn = document.getElementById('btn-toggle-filtros');
  if (btn) btn.classList.toggle('tem-filtros', count > 0);
}

function atualizarContagemResultados(encontrados, total) {
  const el = document.getElementById('resultado-contagem');
  if (!el) return;
  if (encontrados === total) {
    el.textContent = `${total} imóvel${total !== 1 ? 's' : ''} cadastrado${total !== 1 ? 's' : ''}`;
  } else {
    el.textContent = `${encontrados} de ${total} imóvel${total !== 1 ? 's' : ''} encontrado${encontrados !== 1 ? 's' : ''}`;
  }
}
