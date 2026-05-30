/* arquivo: f-versao.js | versao: 0.6.0 */
/* ============================================================
   f-versao.js — Controle de versão do Zillow BR · Ficha Técnica
   Fonte única de verdade para versão e changelog da ficha.
   Carregado em: ficha/index.html e ficha/f-changelog.html
   ============================================================ */

const VERSAO_ATUAL = '0.6.0';

const CHANGELOG = [
  {
    versao: '0.6.0',
    data:   '29/Mai/2026',
    titulo: 'Correções de usabilidade e padronização',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'CEP genérico: campos Rua e Bairro ficam editáveis quando o ViaCEP não retorna logradouro, com placeholder explicativo.',
          'CRECI-J visível apenas quando Tipo de anunciante = Imobiliária.',
          'Campo CPF exibe CNPJ automaticamente quando Tipo = Imobiliária.',
          'Badge numérico de sala some quando há apenas uma sala cadastrada.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'dadosCadastrante renomeado para dadosAnunciante — alinhado com o portal.',
          'Export Excel: coluna A passa a usar "Anunciante" em vez de "Cadastrante".',
          'Numeração de quartos corrigida ao restaurar cômodo do cache — re-renderiza todos em ordem.',
          'f-dominios.json: label "Quantidade" corrigido para "Número de tomadas" em Elétrica e Banheiro.',
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
    titulo: 'Reorganização de estrutura e novidades no portal',
    grupos: [
      {
        categoria: 'Sistema & Código',
        itens: [
          'Todos os arquivos renomeados com prefixos f- (ficha) e p- (portal) para evitar ambiguidade.',
          'Pasta js/ criada dentro de ficha/ para organizar os scripts.',
          'f-versao.js movido para ficha/js/f-versao.js.',
          'f-dominios.json renomeado de dominios.json.',
          'Portal: todos os JS na pasta portal/js/ com prefixo p-.',
          'Cabeçalho padronizado em todos os arquivos: arquivo: nome | versao: X.X.X.',
        ]
      },
      {
        categoria: 'Interface & Funcionalidades',
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
    data:   '26/Mai/2026',
    titulo: 'Melhorias de usabilidade e estrutura',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Salas agora são numeráveis: Sala 1, Sala 2... Quando há apenas uma, aparece somente "Sala".',
          'Ao remover um cômodo, os dados preenchidos são preservados em cache. Clicar em "+ Adicionar" restaura o cômodo com tudo que havia sido preenchido.',
          'Botão "↺ Limpar campos" dentro de cada cômodo para zerar os campos explicitamente quando necessário.',
          'Seções Anunciante e Localização agora são minimizáveis com accordion, igual aos cômodos.',
          'Campo "Tipo de Imóvel" adicionado com lista predefinida em três grupos: Residencial, Terreno / Rural e Comercial.',
          'Filtro completo no portal: busca livre, Estado→Cidade encadeados, cômodos mínimos, tipo de anunciante, tipo de imóvel, ordenação.',
          'Badge no botão Filtros indica quantos filtros estão ativos.',
          'Accordion na página do imóvel — Localização abre, Anunciante fecha.',
          'Tabela resumo de cômodos no topo da página do imóvel.',
          'Cômodos colapsáveis na página do imóvel.',
          'Área total calculada automaticamente.',
          'Tipo de imóvel como meta-tag no card.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'Tipo de Imóvel exportado no Excel dentro do grupo Localização.',
          'Nome do arquivo Excel corrigido: FT_{CEP}_{Numero}_{Complemento}.xlsx.',
          'Todas as salas visíveis são exportadas com numeração correta.',
          'Suporte a .xlsm na importação além de .xlsx.',
          'Botão de versão no header da ficha e do portal.',
          'Páginas f-changelog.html e p-changelog.html com histórico completo.',
        ]
      }
    ]
  },
  {
    versao: '0.2.0',
    data:   '21/Mai/2026',
    titulo: 'Ficha interativa por cômodo',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Cômodos implementados como cards accordion: clica no header para abrir ou fechar.',
          'Barra de progresso: "X de Y campos preenchidos" atualizada em tempo real.',
          'Badge "✓ Completo" aparece quando todos os campos estão preenchidos.',
          'Campo de apelido (referência interna) em cada cômodo — não exportado.',
          'Suporte a Suíte: "É suíte = Sim" abre subgrupo de banheiro dentro do quarto.',
          'Dimensões: Retangular (cálculo automático de área) e Planta irregular (m² direto).',
          'Busca automática por CEP via ViaCEP.',
          'Máscara no campo CEP (00000-000).',
          'Botão Exportar desabilitado até CEP, Número e ao menos um cômodo preenchidos.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'Renumeração automática dos quartos ao remover um intermediário.',
          'Estrutura de exportação Excel: 4 colunas — Cômodo | Grupo | Característica | Valor.',
          'Linhas em branco não exportadas.',
          'Suíte X exportado corretamente.',
        ]
      }
    ]
  },
  {
    versao: '0.1.0',
    data:   '20/Mai/2026',
    titulo: 'Versão inicial — estrutura base',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Estrutura inicial com seções Anunciante, Localização e Cômodos.',
          'Campos básicos de anunciante: Tipo, Nome, CPF, CRECI, Telefone, E-mail.',
          'Suporte a Sala única e múltiplos Quartos.',
          'Exportação básica para Excel.',
        ]
      },
      {
        categoria: 'Sistema & Código',
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
