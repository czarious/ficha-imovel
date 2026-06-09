/* arquivo: p-acoes.js | versao: 0.1.0 */
/* ============================================================
   p-acoes.js — Ações da ficha do imóvel (p-imovel.html)

   Agrupa as três ações da página de detalhe: copiar link,
   botão flutuante de WhatsApp e exclusão. Antes inline no HTML.

   Depende de: mostrarToast [p-ui.js] · deleteImovel [p-storage.js].
   Usa elementos de p-imovel.html: #btn-wpp-flutuante, #btn-excluir,
   #modal-excluir e seus botões.
   ============================================================ */

/** Copia a URL atual da ficha para a área de transferência. */
function copiarLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    mostrarToast('Link copiado!', 'sucesso', '🔗');
  }).catch(() => {
    mostrarToast('Não foi possível copiar o link.', 'erro', '❌');
  });
}

/* ============================================================
   Botão WhatsApp flutuante
   Prefere WhatsApp do Responsável; cai para Telefone do anunciante.
   ============================================================ */
function renderizarBotaoWhatsApp(imovel) {
  if (!imovel) return;

  const botao = document.getElementById('btn-wpp-flutuante');
  if (!botao) return;

  const loc = imovel.localizacao || {};
  const cad = imovel.anunciante  || {};

  /* Prefere WhatsApp do responsável; fallback para Telefone */
  const numeroRaw = cad['WhatsApp do Responsável'] || cad['Telefone'] || '';
  const telefone  = numeroRaw.replace(/\D/g, '');

  /* Endereço para a mensagem pré-preenchida */
  const endMsg = [
    loc['Rua'], loc['Número'] || loc['Numero'],
    loc['Complemento'], loc['Cidade']
  ].filter(Boolean).join(', ');

  const mensagem = encodeURIComponent(
    `Olá! Vi o imóvel no ${APP_NOME} (${endMsg}) e tenho interesse. Poderia me dar mais informações?`
  );

  if (!telefone) return;

  const linkWA = `https://wa.me/55${telefone}?text=${mensagem}`;

  botao.style.display = 'block';
  botao.innerHTML = `
    <a
      href="${linkWA}"
      target="_blank"
      rel="noopener noreferrer"
      data-tooltip="Falar com o anunciante"
      aria-label="Falar com o anunciante via WhatsApp"
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>`;
}

/* ============================================================
   Botão excluir — async pois deleteImovel usa Drive API
   ============================================================ */
function configurarBotaoExcluir(imovel) {
  const btnExcluir = document.getElementById('btn-excluir');
  if (!imovel || !btnExcluir) return;

  btnExcluir.addEventListener('click', () => {
    const overlay = document.getElementById('modal-excluir');
    overlay.style.display = 'flex';
    void overlay.offsetHeight;
    overlay.classList.add('ativo');

    document.getElementById('btn-modal-confirmar-excluir').onclick = async () => {
      try {
        overlay.classList.remove('ativo');
        setTimeout(() => { overlay.style.display = 'none'; }, 250);
        mostrarToast('Excluindo imóvel…', '', '⏳');
        await deleteImovel(imovel.id);
        sessionStorage.setItem('zillow_br_toast', JSON.stringify({
          mensagem: 'Imóvel excluído com sucesso.',
          tipo: 'aviso',
          icone: '🗑️'
        }));
        window.location.href = 'index.html';
      } catch (e) {
        mostrarToast('Erro ao excluir. Tente novamente.', 'erro', '❌');
      }
    };

    document.getElementById('btn-modal-cancelar-excluir').onclick = () => {
      overlay.classList.remove('ativo');
      setTimeout(() => { overlay.style.display = 'none'; }, 250);
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('ativo');
        setTimeout(() => { overlay.style.display = 'none'; }, 250);
      }
    }, { once: true });
  });
}
