/* arquivo: p-mapa.js | versao: 0.7.2 */
/* ============================================================
   p-mapa.js — Camada de renderização do mapa (Portal)
   Provedor atual: Leaflet + tiles OpenStreetMap (grátis, sem chave).

   Para trocar de provedor (Google Maps, Mapbox), reescreva SÓ este
   arquivo: mantenha a assinatura de renderizarMapa() e o resto do
   site não muda uma linha.

   Depende de: Leaflet (CSS + JS) carregado na página antes deste script.
   ============================================================ */

/**
 * Desenha um mapa com um PIN na coordenada informada.
 *
 * Aceita lat/lng como número OU string (o parser entrega string).
 * Retorna boolean para o chamador decidir o fallback (geocodificar na
 * hora, esconder a seção, etc.) quando não há coordenada válida.
 *
 * @param {string} idElemento — id da <div> que recebe o mapa
 * @param {number|string} lat
 * @param {number|string} lng
 * @param {string} [titulo] — texto do popup do PIN
 * @returns {boolean} true se desenhou; false se faltou dado ou biblioteca
 */
function renderizarMapa(idElemento, lat, lng, titulo = '') {
  const el = document.getElementById(idElemento);
  if (!el) return false;

  /* Coerção tolerante: aceita "-21.22" (string) ou -21.22 (número) */
  const xlat = Number(lat);
  const xlng = Number(lng);
  if (!Number.isFinite(xlat) || !Number.isFinite(xlng)) return false;

  /* Leaflet precisa estar carregado (CDN na página) */
  if (typeof L === 'undefined') {
    console.warn('[mapa] Leaflet não carregado.');
    return false;
  }

  const mapa = L.map(idElemento).setView([xlat, xlng], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(mapa);

  const marcador = L.marker([xlat, xlng]).addTo(mapa);
  if (titulo) marcador.bindPopup(titulo);

  setTimeout(() => mapa.invalidateSize(), 200);

  return true;
}

/**
 * Orquestra o mapa de um imóvel: prefere lat/lng salvos no Excel; arquivos
 * antigos sem coordenada caem no geocode na hora. Só revela a seção se desenhar.
 *
 * Depende de: geocodificarEndereco() [g-geo.js] e formatarEndereco() [p-ui.js].
 *
 * @param {Object} imovel — objeto imóvel (com .localizacao)
 * @param {string} [idSecao='secao-mapa'] — seção a revelar quando o mapa desenha
 * @param {string} [idMapa='mapa-imovel'] — div que recebe o mapa
 */
async function montarMapa(imovel, idSecao = 'secao-mapa', idMapa = 'mapa-imovel') {
  if (!imovel) return;
  const loc    = imovel.localizacao || {};
  const titulo = (typeof formatarEndereco === 'function' ? formatarEndereco(loc) : '') || 'Imóvel';

  let lat = loc['Latitude'];
  let lng = loc['Longitude'];

  /* Fallback para arquivos antigos sem coordenada */
  if (!lat || !lng) {
    const coord = await geocodificarEndereco({
      rua:    loc['Rua'] || '',
      numero: loc['Número'] || loc['Numero'] || '',
      cidade: loc['Cidade'] || '',
      uf:     loc['Estado'] || ''
    });
    if (coord) { lat = coord.lat; lng = coord.lng; }
  }

  if (renderizarMapa(idMapa, lat, lng, titulo)) {
    const secao = document.getElementById(idSecao);
    if (secao) secao.style.display = 'block';
  }
}
