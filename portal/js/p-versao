/* versao: 0.3.0 */
/* ============================================================
   versao.js — Controle de versão do Zillow BR · Portal
   Fonte única de verdade para versão e changelog do portal.
   Carregado em: portal/index.html e portal/imovel.html
   ============================================================ */

const VERSAO_PORTAL = '0.3.0';

const CHANGELOG_PORTAL = [
  {
    versao: '0.3.0',
    data:   'Mai/2026',
    titulo: 'Portal publicado com filtros e ficha técnica',
    grupos: [
      {
        categoria: 'Listagem de Imóveis',
        itens: [
          'Grid de cards com foto placeholder, badge de CEP, meta-tags e botão "Ver ficha".',
          'Importação de arquivos .xlsx e .xlsm gerados pela Ficha Técnica.',
          'Deduplicação por CEP + Número + Complemento com modal de confirmação.',
          'Estado vazio com CTA de importação.',
          'Estado "sem resultados" diferenciado do estado "sem imóveis".',
          'Tipo de imóvel exibido como meta-tag azul no card.',
        ]
      },
      {
        categoria: 'Filtros',
        itens: [
          'Busca livre por rua, cidade, CEP e complemento em tempo real.',
          'Filtro por Estado encadeado com Cidade — ao selecionar SP, só aparecem cidades de SP.',
          'Filtro por cômodos mínimos (1 a 6+).',
          'Filtro por tipo de anunciante.',
          'Filtro por tipo de imóvel (Apartamento, Casa, etc.).',
          'Ordenação: mais recente, mais antigo, cidade A→Z, cidade Z→A.',
          'Badge no botão Filtros indica quantos filtros estão ativos.',
          'Botão "Limpar filtros" reseta todos os controles.',
        ]
      },
      {
        categoria: 'Página do Imóvel',
        itens: [
          'Tabela resumo no topo com nome do cômodo e metragem.',
          'Área total calculada automaticamente somando os m² de todos os cômodos.',
          'Seção Localização abre por padrão (accordion).',
          'Seção Anunciante fecha por padrão (accordion).',
          'Cômodos colapsáveis — primeiro abre, demais fecham.',
          'Botão excluir imóvel com modal de confirmação.',
          'Botão imprimir ficha.',
        ]
      },
      {
        categoria: 'Controle de Versão',
        itens: [
          'Botão de versão no header do portal.',
          'Página changelog.html com histórico completo.',
          'versao.js como fonte única de verdade para versão e changelog.',
        ]
      }
    ]
  }
];

function abrirChangelogPortal() {
  window.location.href = 'changelog.html';
}
