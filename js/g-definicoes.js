/* arquivo: g-definicoes.js | versao: 0.7.7 */
/* ============================================================
   g-definicoes.js — Fonte única de definições de termos do domínio imobiliário.
   Usado por: f-ficha.html (tooltips), p-render.js (portal), qualquer página futura.
   Para acrescentar um termo: adicionar uma entrada em DEFINICOES.
   ============================================================ */

const DEFINICOES = {

  /* ── Áreas ─────────────────────────────────────────────── */

  area_terreno: {
    label: 'Área do terreno (m²)',
    texto: 'Superfície total do lote ou gleba onde o imóvel está implantado, incluindo área construída e descoberta. Dado que consta na matrícula no Cartório de Registro de Imóveis.'
  },

  area_privativa: {
    label: 'Área privativa (m²)',
    texto: 'Área de uso exclusivo do proprietário conforme matrícula. Inclui o espaço interno e o espaço ocupado pelas paredes. Base para o cálculo do custo por m². Ref: ABNT NBR 12.721.'
  },

  area_util: {
    label: 'Área útil (m²)',
    texto: 'Soma das áreas dos cômodos sem contar paredes e pilares. "Área de vassoura". Em média 10–15% menor que a área privativa. Opcional — não é derivada da soma dos ambientes cadastrados.'
  },

  area_comum: {
    label: 'Área comum — fração ideal (m²)',
    texto: 'Parcela das áreas coletivas do condomínio (hall, escadas, salão, piscina) atribuída proporcionalmente a esta unidade. Consta na matrícula. Ref: Lei nº 4.591/64.'
  },

  fracao_ideal: {
    label: 'Fração ideal (%)',
    texto: 'Percentual do terreno e das coisas comuns do condomínio que pertence a esta unidade. Base para rateio de condomínio e IPTU. Ref: ABNT NBR 12.721 e Lei nº 4.591/64, art. 3º.'
  },

  area_total: {
    label: 'Área total (m²)',
    texto: 'Soma da área privativa com a área comum (fração ideal). Para imóveis sem condomínio: Área Total = Área Privativa. Para terrenos: Área Total = Área do Terreno. Ref: ABNT NBR 12.721.'
  },

  area_construida: {
    label: 'Área construída (m²)',
    texto: 'Área total construída desta edificação conforme projeto aprovado ou medição. Inclui paredes, pilares e circulação interna. Informado manualmente — não derivado da soma dos cômodos.'
  },

  /* ── Custos ─────────────────────────────────────────────── */

  custo_venda: {
    label: 'Valor de venda (R$)',
    texto: 'Valor total de venda do imóvel em reais.'
  },

  custo_aluguel: {
    label: 'Valor de aluguel (R$/mês)',
    texto: 'Valor mensal do aluguel em reais.'
  },

  custo_condominio: {
    label: 'Condomínio (R$/mês)',
    texto: 'Taxa mensal de condomínio. Aplicável a apartamentos e casas em condomínio fechado.'
  },

  custo_iptu: {
    label: 'IPTU (R$/ano)',
    texto: 'Imposto Predial e Territorial Urbano — valor anual conforme carnê do imóvel.'
  },

  custo_r_m2_venda: {
    label: 'Valor por m² — venda (R$/m²)',
    texto: 'Calculado: Valor de venda ÷ Área base (privativa para edificados, terreno para lotes e rurais, área construída para galpões). Ref: ABNT NBR 14.653.'
  },

  custo_r_m2_aluguel: {
    label: 'Valor por m² — aluguel (R$/m²)',
    texto: 'Calculado: Valor de aluguel mensal ÷ Área privativa. Ref: ABNT NBR 14.653.'
  },

};

/**
 * Retorna a definição de um termo pelo label que aparece no Excel / portal.
 * Uso em p-render.js: getDefPorLabel('Área privativa (m²)')
 */
function getDefPorLabel(label) {
  return Object.values(DEFINICOES).find(d => d.label === label) || null;
}
