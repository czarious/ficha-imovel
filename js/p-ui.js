/* arquivo: p-ui.js | versao: 0.7.1 */
/* ============================================================
   p-ui.js — Utilitários de interface
   Zillow BR Portal | Responsabilidade: modais, toasts, login, helpers
   Depende de: g-config.js (APP_NOME)
   ============================================================ */

/* ----------------------------------------------------------------
   TOAST — Notificações temporárias (canto inferior direito)
   Tipos aceitos: 'sucesso' | 'erro' | 'aviso' | '' (neutro)
   ---------------------------------------------------------------- */

/**
 * Exibe uma notificação tipo toast por ~3 segundos.
 * @param {string} mensagem
 * @param {'sucesso'|'erro'|'aviso'|''} tipo
 * @param {string} [icone]
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

  setTimeout(() => { toast.remove(); }, 3100);
}

/**
 * Mostra (uma vez) um toast que outra página deixou em sessionStorage
 * antes de redirecionar. Chave: TOAST_KEY (g-config.js). Escrito por
 * cadastro.html (via p-import.js) e pela exclusão em p-acoes.js.
 */
function mostrarToastPendente() {
  const pendente = sessionStorage.getItem(TOAST_KEY);
  if (!pendente) return;
  try {
    const { mensagem, tipo, icone } = JSON.parse(pendente);
    setTimeout(() => mostrarToast(mensagem, tipo, icone), 300);
  } catch (e) {}
  sessionStorage.removeItem(TOAST_KEY);
}

/* ----------------------------------------------------------------
   MODAL — Diálogos de confirmação
   ---------------------------------------------------------------- */

/**
 * Abre o modal de duplicata.
 * Retorna Promise que resolve com true (atualizar) ou false (cancelar).
 * @param {string} enderecoImovel
 * @returns {Promise<boolean>}
 */
function abrirModalDuplicata(enderecoImovel) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('modal-duplicata');
    const texto   = document.getElementById('modal-texto-detalhe');

    if (texto) texto.textContent = enderecoImovel;

    overlay.style.display = 'flex';
    void overlay.offsetHeight;
    overlay.classList.add('ativo');

    const btnAtualizar = document.getElementById('btn-modal-atualizar');
    const btnCancelar  = document.getElementById('btn-modal-cancelar');

    const novoAtualizar = btnAtualizar.cloneNode(true);
    const novoCancelar  = btnCancelar.cloneNode(true);
    btnAtualizar.parentNode.replaceChild(novoAtualizar, btnAtualizar);
    btnCancelar.parentNode.replaceChild(novoCancelar, btnCancelar);

    novoAtualizar.addEventListener('click', () => { fecharModal('modal-duplicata'); resolve(true);  });
    novoCancelar.addEventListener('click',  () => { fecharModal('modal-duplicata'); resolve(false); });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) { fecharModal('modal-duplicata'); resolve(false); }
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
  setTimeout(() => { overlay.style.display = 'none'; }, 250);
}

/* ----------------------------------------------------------------
   LOGIN GOOGLE — botão e estado de autenticação
   ---------------------------------------------------------------- */

/**
 * Renderiza o botão "Entrar com Google" no container indicado.
 * Visível apenas quando operação de escrita é necessária.
 * @param {string} idContainer — ID do elemento onde o botão será inserido
 */
function renderizarBotaoLogin(idContainer) {
  const container = document.getElementById(idContainer);
  if (!container) return;

  container.innerHTML = `
    <button
      class="btn-google-login"
      onclick="solicitarToken().then(() => atualizarEstadoLogin())"
      aria-label="Entrar com Google para importar imóveis"
      title="Necessário para importar ou excluir imóveis"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
        <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
      Entrar com Google
    </button>`;
}

/**
 * Atualiza visibilidade do botão de login conforme estado OAuth.
 * Esconde o botão se já autenticado, mostra se não.
 */
function atualizarEstadoLogin() {
  const btnLogin = document.getElementById('container-btn-login');
  if (!btnLogin) return;
  btnLogin.style.display = (typeof _tokenAcesso !== 'undefined' && _tokenAcesso)
    ? 'none'
    : 'block';
}

/* ----------------------------------------------------------------
   HELPERS gerais
   ---------------------------------------------------------------- */

/**
 * Formata uma string ISO de data para pt-BR legível.
 * @param {string} iso
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
 * @param {string} nome
 * @returns {string|null}
 */
function obterParam(nome) {
  return new URLSearchParams(window.location.search).get(nome);
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
