/* arquivo: g-menu.js | versao: 0.1.1 */

/* Injeta a sidebar em qualquer página.
   A página deve declarar MENU_BASE antes de carregar este script:
   - Páginas do portal (raiz): const MENU_BASE = './'
   - f-ficha.html: const MENU_BASE = './'
*/
(function () {
  const base   = (typeof MENU_BASE    !== 'undefined') ? MENU_BASE    : './';
  const versao = (typeof VERSAO_PORTAL !== 'undefined') ? VERSAO_PORTAL : '—';
  const nome   = (typeof APP_NOME      !== 'undefined') ? APP_NOME      : 'Zillow BR';
  const path = window.location.pathname;
  const ativo = (page) => path.endsWith(page) ? 'ativo' : '';

  document.body.insertAdjacentHTML('afterbegin', `
    <aside id="sidebar">
      <div class="sidebar-logo">
        <div>
          <div class="sidebar-logo-icone">🏡</div>
          <div class="sidebar-logo-nome">${nome}</div>
        </div>
        <button class="sidebar-versao" onclick="window.location.href='${base}g-changelog.html'" title="Ver histórico de versões">v${versao}</button>
      </div>
      <nav class="sidebar-nav">
        <a href="${base}index.html"    class="${ativo('index.html')}">🏠 Home</a>
        <a href="${base}cadastro.html" class="${ativo('cadastro.html')}">🏢 Cadastro de Imóvel</a>
        <a href="#" class="nav-vazio">📞 Contato</a>
        <a href="#" class="nav-vazio">❓ Suporte</a>
      </nav>
    </aside>`);
})();
