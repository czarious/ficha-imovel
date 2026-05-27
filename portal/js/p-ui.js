/* arquivo: p-ui.js | versao: 0.4.0 */
/* ============================================================
   p-ui.js — Utilitários de interface
   Zillow BR Portal | Responsabilidade: modais, toasts, helpers
   Sem dependências externas — usa apenas APIs nativas do browser
   ============================================================ */

/* ----------------------------------------------------------------
   TOAST — Notificações temporárias (canto inferior direito)
   Tipos aceitos: 'sucesso' | 'erro' | 'aviso' | '' (neutro)
   ---------------------------------------------------------------- */

/**
 * Exibe uma notificação tipo toast por ~3 segundos.
 * @param {string} mensagem — texto a exibir
 * @param {'sucesso'|'erro'|'aviso'|''} tipo
 * @param {string} [icone] — emoji/ícone opcional
 */
function mostrarToast(mensagem, tipo = '', icone = '') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`.trim();
  toast.innerHTML = icone
    ? `<span>${icone}</span><span>${mensagem}</span>`
    : `<span>${mensagem}</span>`;

  container.appendChild(toast);

  // Remove do DOM após a animação de saída (3 s total)
  setTimeout(() => {
    toast.remove();
  }, 3100);
}

/* ----------------------------------------------------------------
   MODAL — Diálogos de confirmação
   ---------------------------------------------------------------- */

/**
 * Abre o modal de duplicata e retorna uma Promise que resolve com:
 *   true  → usuário clicou em "Atualizar"
 *   false → usuário clicou em "Cancelar"
 * @param {string} enderecoImovel — texto descritivo do imóvel duplicado
 * @returns {Promise<boolean>}
 */
function abrirModalDuplicata(enderecoImovel) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('modal-duplicata');
    const texto   = document.getElementById('modal-texto-detalhe');

    // Preenche o detalhe com o endereço do imóvel encontrado
    if (texto) {
      texto.textContent = enderecoImovel;
    }

    // Abre: define display:flex (fallback se CSS não carregou) e adiciona classe .ativo (animação)
    overlay.style.display = 'flex';
    // Força reflow para a transição de opacity funcionar
    void overlay.offsetHeight;
    overlay.classList.add('ativo');

    // Remove listeners antigos clonando os botões (evita acúmulo de handlers)
    const btnAtualizar = document.getElementById('btn-modal-atualizar');
    const btnCancelar  = document.getElementById('btn-modal-cancelar');

    const novoAtualizar = btnAtualizar.cloneNode(true);
    const novoCancelar  = btnCancelar.cloneNode(true);
    btnAtualizar.parentNode.replaceChild(novoAtualizar, btnAtualizar);
    btnCancelar.parentNode.replaceChild(novoCancelar, btnCancelar);

    novoAtualizar.addEventListener('click', () => {
      fecharModal('modal-duplicata');
      resolve(true);
    });

    novoCancelar.addEventListener('click', () => {
      fecharModal('modal-duplicata');
      resolve(false);
    });

    // Fecha ao clicar fora do modal
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        fecharModal('modal-duplicata');
        resolve(false);
      }
    }, { once: true });
  });
}

/**
 * Fecha um modal pelo ID do overlay.
 * @param {string} idOverlay
 */
function fecharModal(idOverlay) {
  const overlay = document.getElementById(idOverlay);
  if (!overlay) return;
  overlay.classList.remove('ativo');
  // Aguarda a transição de opacity terminar para esconder o elemento
  setTimeout(() => { overlay.style.display = 'none'; }, 250);
}

/* ----------------------------------------------------------------
   HELPERS gerais
   ---------------------------------------------------------------- */

/**
 * Formata uma string ISO de data para pt-BR legível.
 * @param {string} iso — ex: "2026-05-20T14:30:00.000Z"
 * @param {'curto'|'longo'} [formato='curto']
 * @returns {string}
 */
function formatarData(iso, formato = 'curto') {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return '—';

  const opcoes = formato === 'longo'
    ? { day: '2-digit', month: 'long',  year: 'numeric' }
    : { day: '2-digit', month: 'short', year: 'numeric' };

  return d.toLocaleDateString('pt-BR', opcoes);
}

/**
 * Retorna o parâmetro de query string pelo nome.
 * Exemplo: obterParam('id') para ?id=abc123
 * @param {string} nome
 * @returns {string|null}
 */
function obterParam(nome) {
  const params = new URLSearchParams(window.location.search);
  return params.get(nome);
}

/**
 * Monta a string de endereço formatado a partir do objeto localizacao.
 * @param {Object} loc — imovel.localizacao
 * @returns {string}
 */
function formatarEndereco(loc) {
  const rua    = loc['Rua']    || '';
  const numero = loc['Número'] || loc['Numero'] || '';
  const compl  = loc['Complemento'] || '';
  const partes = [rua, numero].filter(Boolean).join(', ');
  return compl ? `${partes} — ${compl}` : partes;
}
