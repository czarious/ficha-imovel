/* arquivo: g-geo.js | versao: 0.7.1 */
/* ============================================================
   g-geo.js — Camada de geocodificação (endereço -> coordenada)
   Compartilhado: Ficha (grava lat/lng no Excel) + Portal (fallback)
   Provedor atual: Nominatim / OpenStreetMap (grátis, sem chave).
   Para trocar de provedor (Google, Mapbox), reescreva SÓ este arquivo.
   ============================================================ */

/**
 * Converte um endereço em coordenadas { lat, lng }.
 *
 * Precisão: nível de rua (não rooftop). É best-effort — retorna null em
 * qualquer falha (rede, endereço não encontrado), e o chamador deve seguir
 * normalmente sem coordenada. NUNCA deve travar o cadastro.
 *
 * O navegador envia o cabeçalho Referer automaticamente, o que satisfaz a
 * política de uso do Nominatim — não setamos User-Agent (proibido no browser).
 *
 * @param {{rua?:string, numero?:string, cidade?:string, uf?:string}} endereco
 * @returns {Promise<{lat:number, lng:number}|null>}
 */
async function geocodificarEndereco(endereco) {
  const { rua = '', numero = '', cidade = '', uf = '' } = endereco || {};

  /* Sem rua nem cidade não há o que buscar */
  if (!rua && !cidade) return null;

  /* Nominatim aceita "número rua" no campo street */
  const street = [numero, rua].filter(Boolean).join(' ').trim();

  const params = new URLSearchParams({
    format:  'jsonv2',
    street:  street,
    city:    cidade,
    state:   uf,
    country: 'Brasil',
    limit:   '1'
  });

  const url = `https://nominatim.openstreetmap.org/search?${params}`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;

    const dados = await resp.json();
    if (!Array.isArray(dados) || dados.length === 0) return null;

    const lat = parseFloat(dados[0].lat);
    const lng = parseFloat(dados[0].lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    return { lat, lng };
  } catch (e) {
    console.warn('[geo] Falha ao geocodificar:', e);
    return null;
  }
}
