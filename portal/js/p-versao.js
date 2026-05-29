/* arquivo: p-versao.js | versao: 0.6.1 */
/* ============================================================
   p-versao.js — Controle de versão do Zillow BR · Portal
   Fonte única de verdade para versão e changelog do portal.
   Carregado em: portal/index.html e portal/p-imovel.html
   ============================================================ */

const VERSAO_PORTAL = '0.6.1';

const CHANGELOG_PORTAL = [
  {
    versao: '0.6.1',
    data:   '28/Mai/2026',
    titulo: 'Correção de autenticação OAuth',
    grupos: [
      {
        categoria: 'Sistema & Código',
        itens: [
          'Correção crítica: script do Google Identity Services passa a usar onload para garantir inicialização correta do OAuth antes do primeiro uso.',
          'Botão "Entrar com Google" removido do header — login acontece automaticamente no fluxo de importação.',
        ]
      }
    ]
  },
  {
    versao: '0.6.0',
    data:   '28/Mai/2026',
    titulo: 'Google Drive como storage e validação de importação',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Botão "Entrar com Google" no header — aparece automaticamente quando necessário para importar ou excluir.',
          'Estado de carregamento ao abrir o portal enquanto os imóveis são buscados no Drive.',
          'Toast "Enviando para o Drive…" durante o upload, mantendo o usuário informado.',
          'Mensagem de erro genérica para arquivos inválidos — não revela critérios de validação.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'Google Drive substitui localStorage como banco de dados — imóveis acessíveis de qualquer dispositivo.',
          'p-config.js criado como fonte única de verdade para constantes globais: nome do app, Client ID, API Key, ID da pasta Drive.',
          'Validação de schema na importação — 6 verificações antes de aceitar o arquivo.',
          'OAuth 2.0 implementado via Google Identity Services — login seguro sem expor credenciais.',
          'API Key restrita ao domínio czarious.github.io e à Drive API.',
        ]
      }
    ]
  },
  {
    versao: '0.5.0',
    data:   '28/Mai/2026',
    titulo: 'WhatsApp flutuante e padronização do portal',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Botão WhatsApp flutuante fixo no canto inferior direito da página do imóvel.',
          'Número puxado automaticamente do campo Telefone do anunciante — sem configuração manual.',
          'Mensagem pré-preenchida com o endereço do imóvel ao abrir o WhatsApp.',
          'Botão só aparece quando o anunciante tem telefone cadastrado.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'Renomeação global de cadastrante → anunciante em todos os arquivos do portal.',
          'Categorias do changelog redefinidas: Interface & Funcionalidades e Sistema & Código.',
          'Datas completas nas versões — formato DD/Mmm/AAAA aplicado retroativamente em todas as versões.',
        ]
      }
    ]
  },
  {
    versao: '0.4.0',
    data:   '27/Mai/2026',
    titulo: 'Reorganização de estrutura e novos recursos',
    grupos: [
      {
        categoria: 'Sistema & Código',
        itens: [
          'Todos os arquivos renomeados com prefixos f- (ficha) e p- (portal).',
          'Todos os JS do portal movidos para portal/js/ com prefixo p-.',
          'CSS renomeado para p-style.css.',
          'Cabeçalho padronizado em todos os arquivos: arquivo: nome | versao: X.X.X.',
          'p-versao.js movido para portal/js/p-versao.js.',
          'p-imovel.html renomeado de imovel.html.',
        ]
      },
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Seção "Destaques" no topo — badges automáticos de todos os atributos marcados como Sim.',
          'Botão WhatsApp flutuante na página do imóvel — abre conversa com o anunciante com mensagem e endereço pré-preenchidos.',
          'Botão de versão no header abrindo p-changelog.html.',
        ]
      }
    ]
  },
  {
    versao: '0.3.0',
    data:   '26/Mai/2026',
    titulo: 'Portal publicado com filtros e ficha técnica',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Grid de cards com foto placeholder, badge de CEP, meta-tags e botão "Ver ficha".',
          'Importação de arquivos .xlsx e .xlsm gerados pela Ficha Técnica.',
          'Deduplicação por CEP + Número + Complemento com modal de confirmação.',
          'Estado vazio com CTA de importação.',
          'Estado "sem resultados" diferenciado do estado "sem imóveis".',
          'Tipo de imóvel exibido como meta-tag no card.',
          'Busca livre por rua, cidade, CEP e complemento em tempo real.',
          'Filtro por Estado encadeado com Cidade.',
          'Filtro por cômodos mínimos (1 a 6+).',
          'Filtro por tipo de anunciante e tipo de imóvel.',
          'Ordenação: mais recente, mais antigo, cidade A→Z, cidade Z→A.',
          'Badge no botão Filtros indica quantos filtros estão ativos.',
          'Botão "Limpar filtros" reseta todos os controles.',
          'Tabela resumo no topo com nome do cômodo e metragem.',
          'Área total calculada automaticamente.',
          'Seção Localização abre por padrão, Anunciante fecha por padrão.',
          'Cômodos colapsáveis na página do imóvel.',
          'Botão excluir imóvel com modal de confirmação.',
          'Botão imprimir ficha.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'Botão de versão no header do portal.',
          'Página p-changelog.html com histórico completo.',
          'p-versao.js como fonte única de verdade para versão e changelog do portal.',
        ]
      }
    ]
  }
];

function abrirChangelogPortal() {
  window.location.href = '../p-changelog.html';
}
