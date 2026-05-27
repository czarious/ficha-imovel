/* versao: 0.3.0 */
/* ============================================================
   f-versao.js — Controle de versão do Zillow BR · Ficha Técnica
   Fonte única de verdade para versão e changelog da ficha.
   Carregado em: ficha/index.html e ficha/f-changelog.html
   ============================================================ */

const VERSAO_ATUAL = '0.3.0';

const CHANGELOG = [
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
          'Tipos disponíveis: Apartamento, Casa, Sobrado, Casa em Condomínio, Cobertura, Flat / Apart-hotel, Kitnet / Quitinete, Loft, Studio, Casa Geminada, Edícula, Lote / Terreno, Chácara, Sítio, Fazenda, Sala Comercial, Loja, Galpão, Prédio Comercial.',
          'Tipo de Imóvel exportado no Excel dentro do grupo Localização.',
        ]
      },
      {
        categoria: 'Ficha Técnica — Exportação Excel',
        itens: [
          'Nome do arquivo corrigido: FT_{CEP}_{Numero}_{Complemento}.xlsx — o Número agora aparece corretamente, sem prefixo BR_.',
          'Quando não há complemento, o nome fica FT_{CEP}_{Numero}.xlsx.',
          'Todas as salas visíveis são exportadas com numeração correta.',
        ]
      },
      {
        categoria: 'Estrutura do Repositório',
        itens: [
          'dominios.json movido para ficha/dominios/dominios.json.',
          'Arquivos da ficha renomeados com prefixo f-: f-versao.js, f-changelog.html.',
          'Arquivos do portal renomeados com prefixo p-: p-versao.js, p-changelog.html, p-render.js.',
        ]
      },
      {
        categoria: 'Portal — Filtros',
        itens: [
          'Filtro completo adicionado na listagem: busca livre, Estado→Cidade encadeados, cômodos mínimos, tipo de anunciante, tipo de imóvel, ordenação.',
          'Badge no botão Filtros indica quantos filtros estão ativos.',
          'Estado "sem resultados" diferenciado do estado "sem imóveis cadastrados".',
          'Suporte a .xlsm na importação além de .xlsx.',
        ]
      },
      {
        categoria: 'Portal — Ficha do Imóvel',
        itens: [
          'Seção "Destaques" no topo — badges automáticos de todos os atributos = Sim.',
          'Tabela resumo com nome do cômodo e metragem.',
          'Área total calculada automaticamente.',
          'Localização abre por padrão, Anunciante fecha por padrão (accordion).',
          'Cômodos colapsáveis — primeiro abre, demais fecham.',
          'Botão WhatsApp para contato com o responsável.',
        ]
      },
      {
        categoria: 'Controle de Versão',
        itens: [
          'Botão de versão no header da ficha e do portal.',
          'Páginas f-changelog.html e p-changelog.html com histórico completo.',
          'f-versao.js e p-versao.js como fontes únicas de verdade.',
          'Comentário /* versao: X.X.X */ no topo de cada arquivo JS.',
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
          'dominios.json criado com estados, campos do anunciante, atributos comuns e específicos.',
        ]
      }
    ]
  }
];

function abrirChangelog() {
  window.location.href = 'f-changelog.html';
}
