/* ============================================================
   versao.js — Controle de versão do Zillow BR · Ficha Técnica
   Fonte única de verdade para número de versão e changelog.
   Carregado em: ficha/index.html e ficha/changelog.html
   ============================================================ */

const VERSAO_ATUAL = '0.3.0';

/* ────────────────────────────────────────────────────────────
   HISTÓRICO COMPLETO DE VERSÕES
   Ordem: mais recente primeiro
   ──────────────────────────────────────────────────────────── */
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
          'dominios.json movido para ficha/dominios/dominios.json — tudo da ficha centralizado dentro da pasta ficha/.',
          'URL do JSON de domínios atualizada no código.',
          'Portal organizado em ficha/ e portal/ com subpastas css/ e js/.',
        ]
      },
      {
        categoria: 'Portal — Filtros',
        itens: [
          'Filtro completo adicionado na listagem: busca livre por rua, cidade, CEP; filtro por Estado encadeado com Cidade; cômodos mínimos; tipo de anunciante; ordenação.',
          'Badge no botão Filtros indica quantos filtros estão ativos.',
          'Botão "Limpar filtros" reseta todos os controles de uma vez.',
          'Estado "sem resultados" diferenciado do estado "sem imóveis cadastrados".',
          'Suporte a .xlsm na importação além de .xlsx.',
        ]
      },
      {
        categoria: 'Controle de Versão',
        itens: [
          'Botão de versão adicionado no canto superior direito da ficha.',
          'Página dedicada changelog.html com histórico completo de versões.',
          'Arquivo versao.js como fonte única de verdade para versão e changelog.',
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
          'Barra de progresso por cômodo: "X de Y campos preenchidos" atualizada em tempo real.',
          'Badge "✓ Completo" aparece automaticamente quando todos os campos estão preenchidos.',
          'Campo de apelido (referência interna) em cada cômodo — não exportado para o Excel.',
          'Suporte a Suíte: quando "É suíte = Sim", o subgrupo "Banheiro da suíte" aparece dentro do quarto.',
          'Badge "Suíte" exibido no header do cômodo quando ativo.',
          'Dimensões com dois modos: Retangular (Largura × Comprimento com cálculo automático de área) e Planta irregular (campo de m² direto).',
          'Renumeração automática dos quartos ao remover um intermediário.',
        ]
      },
      {
        categoria: 'Ficha Técnica — Localização',
        itens: [
          'Busca automática de endereço pelo CEP via ViaCEP: preenche Rua, Bairro, Cidade e Estado automaticamente.',
          'Máscara aplicada ao campo CEP (00000-000).',
          'Botão "Exportar Excel" desabilitado até CEP, Número e ao menos um cômodo estarem preenchidos.',
        ]
      },
      {
        categoria: 'Ficha Técnica — Exportação Excel',
        itens: [
          'Estrutura de 4 colunas: Cômodo | Grupo | Característica | Valor.',
          'Linhas em branco não exportadas.',
          'Cômodo "Suíte X" exportado corretamente quando "É suíte = Sim".',
          'Dimensões, atributos comuns, atributos específicos e banheiro da suíte todos exportados.',
          'Larguras de coluna otimizadas no arquivo gerado.',
        ]
      },
      {
        categoria: 'Arquitetura',
        itens: [
          'Atributos de cômodo carregados dinamicamente do dominios.json — novos campos sem tocar no HTML.',
          'Estado global separado por escopo: dadosAnunciante, dadosLocalizacao, dadosSala, quartos[].',
          'SheetJS carregado via CDN para geração do Excel no navegador.',
        ]
      },
      {
        categoria: 'Design',
        itens: [
          'Paleta definida: fundo #F5F3EE, verde #2B5F3E, superfície #FFFFFF.',
          'Tipografia DM Serif Display (títulos) + DM Sans (corpo).',
          'Cards com sombra sutil, bordas arredondadas, hover states.',
          'Header verde escuro com título e subtítulo.',
          'Botão "Exportar Excel" fixo no canto inferior direito.',
          'Subgrupo banheiro de suíte com destaque visual roxo.',
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
          'Estrutura inicial da ficha com seções Anunciante, Localização e Cômodos.',
          'Campos básicos de anunciante: Tipo, Nome, CPF, CRECI, CRECI-J, Telefone, E-mail.',
          'Campos básicos de localização: País, CEP, Rua, Bairro, Número, Complemento, Cidade, Estado.',
          'Suporte a Sala única e múltiplos Quartos.',
          'Exportação básica para Excel.',
        ]
      },
      {
        categoria: 'Repositório',
        itens: [
          'Repositório criado: czarious/ficha-imovel.',
          'GitHub Pages habilitado para publicação estática.',
          'Arquivo dominios.json criado com estados, campos do anunciante, atributos comuns e específicos por cômodo.',
          'Estrutura inicial: ficha/index.html + dominios/dominios.json.',
        ]
      }
    ]
  }
];

/* ────────────────────────────────────────────────────────────
   NAVEGAÇÃO
   ──────────────────────────────────────────────────────────── */

/**
 * Abre a página de changelog.
 * Chamado pelo botão de versão no header da ficha.
 */
function abrirChangelog() {
  window.location.href = 'changelog.html';
}
