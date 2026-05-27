/* arquivo: p-storage.js | versao: 0.4.0 */
/* ============================================================
   p-storage.js — Gerenciamento de dados no localStorage
   Zillow BR Portal | Responsabilidade: CRUD de imóveis
   Sem dependências externas — usa apenas API nativa do browser
   ============================================================ */

const CHAVE_STORAGE = 'zillow_br_imoveis';

/**
 * Retorna todos os imóveis salvos.
 * @returns {Array<Object>}
 */
function getImoveis() {
  const dados = localStorage.getItem(CHAVE_STORAGE);
  try {
    return dados ? JSON.parse(dados) : [];
  } catch (e) {
    console.error('[storage] Erro ao ler localStorage:', e);
    return [];
  }
}

/**
 * Persiste a lista completa de imóveis (sobrescreve).
 * @param {Array<Object>} lista
 */
function salvarTodos(lista) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista));
}

/**
 * Retorna um imóvel pelo ID ou null se não encontrado.
 * @param {string} id
 * @returns {Object|null}
 */
function getImovelById(id) {
  return getImoveis().find(i => i.id === id) || null;
}

/**
 * Verifica se já existe um imóvel com os mesmos CEP + Número + Complemento.
 * Usado para deduplicação na importação.
 * @param {string} cep
 * @param {string} numero
 * @param {string} complemento
 * @returns {Object|null} O imóvel existente ou null
 */
function checkDuplicata(cep, numero, complemento) {
  const id = normalizarId(cep, numero, complemento);
  return getImovelById(id);
}

/**
 * Salva um imóvel novo ou atualiza um existente.
 * Usa a posição existente na lista (update in-place) ou insere no topo (novo).
 * @param {Object} imovel — objeto com campo `id` obrigatório
 */
function saveImovel(imovel) {
  const lista = getImoveis();
  const idx = lista.findIndex(i => i.id === imovel.id);
  if (idx >= 0) {
    lista[idx] = imovel; // atualização preserva posição na lista
  } else {
    lista.unshift(imovel); // novo imóvel entra no topo
  }
  salvarTodos(lista);
}

/**
 * Remove um imóvel pelo ID.
 * @param {string} id
 */
function deleteImovel(id) {
  const lista = getImoveis().filter(i => i.id !== id);
  salvarTodos(lista);
}

/**
 * Gera um ID canônico a partir de CEP + Número + Complemento.
 * Remove acentos, espaços e caracteres especiais — só letras e números.
 * Exemplo: "14020-260", "123", "Apto 301" → "14020260_123_apto301"
 *
 * @param {string} cep
 * @param {string} numero
 * @param {string} complemento
 * @returns {string}
 */
function normalizarId(cep, numero, complemento) {
  const limpar = str =>
    (str || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove marcas de acento
      .replace(/[^a-z0-9]/g, '');      // só alfanumérico

  return `${limpar(cep)}_${limpar(numero)}_${limpar(complemento)}`;
}
