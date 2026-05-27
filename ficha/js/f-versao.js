/* arquivo: f-versao.js | versao: 0.4.0 */
/* ============================================================
   f-versao.js — Controle de versão do Zillow BR · Ficha Técnica
   Fonte única de verdade para versão e changelog da ficha.
   Carregado em: ficha/index.html e ficha/f-changelog.html
   ============================================================ */

const VERSAO_ATUAL = '0.4.0';

const CHANGELOG = [
  {
    versao: '0.4.0',
    data:   'Mai/2026',
    titulo: 'Reorganização de estrutura e novidades no portal',
    grupos: [
      {
        categoria: 'Estrutura do Repositório',
        itens: [
          'Todos os arquivos renomeados com prefixos f- (ficha) e p- (portal) para evitar ambiguidade.',
          'Pasta js/ criada dentro de ficha/ para organizar os scripts.',
          'f-versao.js movido para ficha/js/f-versao.js.',
          'dominios.json renomeado para f-dominios.json.',
          'Portal: todos os JS na pasta portal/js/ com prefixo p-.',
          'Cabeçalho padronizado em todos os arquivos: arquivo: nome | versao: X.X.X.',
        ]
      },
      {
        categoria: 'Portal — Novidades',
        itens: [
          'Seção "Destaques" no topo da ficha do imóvel — badges automáticos de todos os atributos = Sim.',
          'Botão WhatsApp na página do imóvel com mensagem pré-preenchida com o endereço.',
          'Botão de versão no header do portal abrindo p-changelog.html.',
          'p-versao.js criado como fonte única de verdade do portal.',
        ]
      }
    ]
  },
  {
    versao: '0.3.0',
    data:   'Mai/2026',
    titulo: 'Melhorias de usabilidade e estrutura',
    grupos: [
      {
        categoria: 'Ficha Técnica — Cômodos',
        itens: [
          'Salas agora são numeráveis: Sala 1, Sala 2... Quando há apenas uma, aparece somente "Sala".',
          'Ao remover um cômodo, os dados preenchidos são preservados em cache. Clicar em "+ Adicionar" restaura o cômodo com tudo que havia sido preenchido.',
          'Botão "↺ Limpar campos" dentro de cada cômodo para zerar os campos explicitamente quando necessário.',
          'Seções Anunciante e Localização agora são minimizáveis com accordion, igual aos cômodos.',
        ]
      },
      {
        categoria: 'Ficha Técnica — Localização',
        itens: [
          'Campo "Tipo de Imóvel" adicionado com lista predefinida em três grupos: Residencial, Terreno / Rural e Comercial.',
          'Tipo de Imóvel exportado no Excel dentro do grupo Localização.',
        ]
      },
      {
        categoria: 'Ficha Técnica — Exportação Excel',
        itens: [
          'Nome do arquivo corrigido: FT_{CEP}_{Numero}_{Complemento}.xlsx.',
          'Todas as salas visíveis são exportadas com numeração correta.',
        ]
      },
      {
        categoria: 'Portal — Filtros',
        itens: [
          'Filtro completo: busca livre, Estado→Cidade encadeados, cômodos mínimos, tipo de anunciante, tipo de imóvel, ordenação.',
          'Badge no botão Filtros indica quantos filtros estão ativos.',
          'Suporte a .xlsm na importação além de .xlsx.',
        ]
      },
      {
        categoria: 'Controle de Versão',
        itens: [
          'Botão de versão no header da ficha e do portal.',
          'Páginas f-changelog.html e p-changelog.html com histórico completo.',
        ]
      }
    ]
  },
  {
    versao: '0.2.0',
    data:   'Mai/2026',
    titulo: 'Ficha interativa por cômodo',
    grupos: [
      {
        categoria: 'Ficha Técnica — Cômodos',
        itens: [
          'Cômodos implementados como cards accordion: clica no header para abrir ou fechar.',
          'Barra de progresso: "X de Y campos preenchidos" atualizada em tempo real.',
          'Badge "✓ Completo" aparece quando todos os campos estão preenchidos.',
          'Campo de apelido (referência interna) em cada cômodo — não exportado.',
          'Suporte a Suíte: "É suíte = Sim" abre subgrupo de banheiro dentro do quarto.',
          'Dimensões: Retangular (cálculo automático de área) e Planta irregular (m² direto).',
          'Renumeração automática dos quartos ao remover um intermediário.',
        ]
      },
      {
        categoria: 'Ficha Técnica — Localização',
        itens: [
          'Busca automática por CEP via ViaCEP.',
          'Máscara no campo CEP (00000-000).',
          'Botão Exportar desabilitado até CEP, Número e ao menos um cômodo preenchidos.',
        ]
      },
      {
        categoria: 'Exportação Excel',
        itens: [
          'Estrutura de 4 colunas: Cômodo | Grupo | Característica | Valor.',
          'Linhas em branco não exportadas.',
          'Suíte X exportado corretamente.',
        ]
      }
    ]
  },
  {
    versao: '0.1.0',
    data:   'Mai/2026',
    titulo: 'Versão inicial — estrutura base',
    grupos: [
      {
        categoria: 'Ficha Técnica',
        itens: [
          'Estrutura inicial com seções Anunciante, Localização e Cômodos.',
          'Campos básicos de anunciante: Tipo, Nome, CPF, CRECI, Telefone, E-mail.',
          'Suporte a Sala única e múltiplos Quartos.',
          'Exportação básica para Excel.',
        ]
      },
      {
        categoria: 'Repositório',
        itens: [
          'Repositório criado: czarious/ficha-imovel.',
          'GitHub Pages habilitado.',
          'f-dominios.json criado com estados, campos do anunciante, atributos comuns e específicos.',
        ]
      }
    ]
  }
];

function abrirChangelog() {
  window.location.href = 'f-changelog.html';
}
