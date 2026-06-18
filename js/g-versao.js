/* arquivo: g-versao.js | versao: 0.7.7 */
/* ============================================================
   g-versao.js — Controle de versão unificado do Zillow BR
   Carregado em: todas as páginas do portal e da ficha.
   ============================================================ */

/* ── VERSÕES ─────────────────────────────────────────────── */
const VERSAO_PORTAL = '0.7.8';
const VERSAO_ATUAL  = '0.7.8'; /* ficha */

/* ── CHANGELOG UNIFICADO (≥ 0.7.1) ───────────────────────────
   A partir da unificação, cada versão tem UMA entrada aqui (sem
   divisão Ficha/Portal). As entradas ≤ 0.7.0 permanecem em
   CHANGELOG (ficha) e CHANGELOG_PORTAL, exibidas divididas no
   g-changelog.html. */
const CHANGELOG_GERAL = [
  {
    versao: '0.7.8',
    data:   '18/Jun/2026',
    titulo: 'Piscina, energia solar e melhorias visuais no portal',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Ficha: novo campo Piscina (Sim/Não)',
          'Ficha: novo campo Energia solar (Sim/Não) com campo condicional de potência (kWp)',
          'Portal: Localização, Informações Técnicas e Custos agora exibidos em tabela (chave/valor)',
          'Portal: hierarquia visual de Edificações corrigida — cada edificação é um container colapsável com borda verde; cômodos ficam dentro do container',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'f-ficha.html: exporta Piscina, Energia solar e Energia solar — potência (kWp) para Informações Técnicas no Excel',
          'p-render.js: renderAtributoTabela() para grupos do imóvel; renderEdificacoes() reescrito com ed-container + toggleEdContainer()',
          'p-style.css: estilos .ficha-tabela, .ed-container, .ed-container-header/nome/arrow/body, .ed-comodos-lista adicionados; .atributo mantido para cômodos',
          'censor-subagent.md: Skill adicionado ao frontmatter para permitir invocação de /code-review',
          'dados/imoveis-teste.json: campos de piscina e energia solar adicionados nos dois imóveis de teste',
        ]
      }
    ]
  },
  {
    versao: '0.7.7',
    data:   '18/Jun/2026',
    titulo: 'Edificações e tooltips contextuais',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Ficha: nova seção Edificações para imóveis rurais e industriais (Chácara, Sítio, Fazenda, Galpão, Prédio Comercial) — múltiplas construções independentes, cada uma com tipo, nome livre e área construída próprios.',
          'Ficha: cada edificação tem sua própria lista de cômodos — mesma interface do cômodo padrão, isolada por edificação.',
          'Ficha: tooltips contextuais em 13 campos de área e custo — ao passar o mouse sobre o nome do campo aparece a definição técnica e o comprovante de cálculo com os valores reais preenchidos.',
          'Portal: tooltips nos campos de área e custo da ficha do imóvel — mesma definição da ficha, sem duplicação.',
          'Ficha: checkboxes Venda e Locação agora exibem marcação visual corretamente (regressão de CSS corrigida).',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'js/g-definicoes.js criado: fonte única de 13 definições de termos imobiliários (ABNT NBR 12.721, NBR 14.653, Lei nº 4.591/64); ficha consome via data-def + tooltipInit(), portal via getDefPorLabel().',
          'p-parser.js: suporte ao marcador [Edificação] na coluna A do Excel — agrupa cômodos em imovel.edificacoes[]; arquivos sem marcador continuam funcionando via imovel.comodos.',
          'p-render.js: renderEdificacoes() exibe cada edificação com título, área construída e cômodos colapsáveis; fallback automático para imovel.comodos em arquivos antigos.',
          'Ficha: TIPOS_COM_EDIFICACOES controla visibilidade da seção Edificações e oculta campos de área privativa/comum nos tipos rurais/industriais.',
          'Ficha: atualizarTooltipsProva() recalcula o comprovante de cálculo em tempo real ao passar o mouse — lê os valores dos campos e monta a fórmula com números reais.',
          'BUG-015 corrigido: tooltipInit() agora chamado no fim de adicionarEdificacao() — labels dinâmicos recebem texto e listeners corretamente.',
          'BUG-016 corrigido: guard typeof DEFINICOES e flag defInjetado em tooltipInit() evitam crash e dupla-injeção.',
        ]
      }
    ]
  },
  {
    versao: '0.7.6',
    data:   '17/Jun/2026',
    titulo: 'Grupo Custos — preço, modalidade e filtro',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Ficha: novo bloco "Custos" na seção Localização com Modalidade (checkboxes Venda/Locação), Valor de venda, Valor de aluguel, Condomínio, IPTU e R$/m² calculado automaticamente.',
          'Ficha: R$/m² calculado em tempo real — área privativa para imóveis edificados, área do terreno para lotes (padrão FipeZAP).',
          'Ficha: bloco Custos aparece somente após selecionar Tipo de imóvel; campos de venda/aluguel aparecem conforme Modalidade selecionada.',
          'Portal: preço e badge de modalidade (Venda / Locação / Venda e Locação) exibidos nos cards.',
          'Portal: filtro de Modalidade — busca por "Venda" retorna também imóveis "Venda e Locação".',
          'Portal: valores monetários formatados automaticamente como R$ 280.000,00 na ficha do imóvel.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'Ficha: calcularRporM2() calcula e salva custo_r_m2_venda e custo_r_m2_aluguel em dadosLocalizacao.',
          'Ficha: atualizarVisibilidadeCustos() controla visibilidade do bloco e dos campos condicionais; chamada ao final de atualizarVisibilidadeAreas().',
          'Ficha: 7 campos do grupo Custos exportados no Excel (Imóvel | Custos | Característica | Valor).',
          'Portal: renderAtributo() em p-render.js detecta campo com "(R$" no nome e formata valor como moeda pt-BR.',
          'Portal: p-cards.js lê imovel.grupos.Custos para exibir preço e badge de modalidade no card.',
          'Portal: p-filtros.js usa .includes() no filtro de Modalidade — "Venda e Locação" aparece nos dois filtros.',
        ]
      }
    ]
  },
  {
    versao: '0.7.5',
    data:   '15/Jun/2026',
    titulo: 'Ficha: grupo Informações Técnicas no Excel',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Portal: seção "Dados do Imóvel" separada de "Localização" na ficha do imóvel — tipo, áreas e fração ideal ficam em bloco próprio.',
          'Portal: accordion no Resumo de cômodos — recolhido por padrão, exibe apenas a área total.',
          'Portal: Latitude e Longitude não aparecem mais na seção Localização da ficha do imóvel.',
          'Portal: mapa renderiza completo ao abrir a página (correção do canto cinza).',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'Ficha: export passa a usar Grupo = "Informações Técnicas" para tipo e campos de área; endereço permanece em "Localização".',
          'Ficha: calcularAreaTotal() corrigido — não somava área_comum em tipos sem condomínio ao trocar tipo de imóvel.',
          'Parser: campos do grupo "Informações Técnicas" agora roteados para imovel.dadosTecnicos; demais campos do Imóvel vão para imovel.localizacao. Arquivos antigos sem esse grupo continuam funcionando.',
          'Infraestrutura de teste: dados/config-teste.js + dados/imoveis-teste.json permitem testar o portal sem consumir quota da Drive API (DADOS_TESTE = true/false em um único arquivo).',
        ]
      }
    ]
  },
  {
    versao: '0.7.4',
    data:   '12/Jun/2026',
    titulo: 'Campos de áreas do imóvel na ficha',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          '6 novos campos na seção Localização da ficha: Área do terreno, Área privativa, Área útil (opcional), Área comum — fração ideal, Fração ideal e Área total.',
          'Visibilidade condicional por tipo de imóvel — Apartamento não exibe área de terreno; Terreno/Lote oculta privativa, útil e áreas de condomínio; apenas Apartamento e Casa em Condomínio exibem área comum e fração ideal.',
          'Área total calculada automaticamente em tempo real (Privativa + Comum; ou Terreno para lotes).',
          'Tooltip ⓘ com definição técnica em cada campo de área — baseado em ABNT NBR 12.721 e Lei nº 4.591/64.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          '6 novos campos exportados no Excel na seção Imóvel > Localização, antes do endereço.',
          'Novos conjuntos TIPOS_COM_CONDOMINIO, TIPOS_SEM_TERRENO e TIPOS_SEM_EDIFICACAO centralizam a lógica condicional.',
        ]
      }
    ]
  },
  {
    versao: '0.7.3',
    data:   '12/Jun/2026',
    titulo: 'Saneamento e limpeza da ficha',
    grupos: [
      {
        categoria: 'Sistema & Código',
        itens: [
          'Comentários históricos CORR-1 a CORR-7 removidos após conclusão das correções.',
          'Variáveis mortas eliminadas; função limparComodo() simplificada.',
          'lang="pt-br" corrigido para "pt-BR"; preconnect de fontes adicionado.',
        ]
      }
    ]
  },
  {
    versao: '0.7.2',
    data:   '12/Jun/2026',
    titulo: 'Ambientes unificados na ficha',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Banheiro, Cozinha e Área de Serviço passam a ser ambientes independentes — mesma hierarquia dos demais cômodos.',
          'Campo "Outro..." permite criar qualquer tipo de ambiente de forma livre.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'f-dominios.json v0.7.2: tipos_ambiente listados explicitamente (Sala, Quarto, Banheiro, Cozinha, Área de Serviço, Garagem, Varanda, Edícula, Outro).',
        ]
      }
    ]
  },
  {
    versao: '0.7.1',
    data:   '08/Jun/2026',
    titulo: 'Nome do site centralizado (fonte única)',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Changelog: data de cada versão restaurada; títulos longos agora limitados (1 linha nas versões novas, até 2 nas antigas) sem estourar o layout.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'Nome do site agora vem de um único lugar — APP_NOME em g-config.js. Trocar lá muda o site inteiro: logo, títulos das abas, changelog e mensagens.',
          'g-config.js passou a ser carregado também em g-changelog.html e f-ficha.html.',
        ]
      }
    ]
  }
];

/* ── CHANGELOG DO PORTAL ─────────────────────────────────── */
const CHANGELOG_PORTAL = [
  {
    versao: '0.7.0',
    data:   '08/Jun/2026',
    titulo: 'Mapa de localização e reorganização do código',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Mapa com PIN na ficha do imóvel (p-imovel.html), no rodapé após o detalhamento por cômodo.',
          'Legenda "localização aproximada" — o PIN reflete o nível de rua do endereço.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'Mapa via Leaflet + OpenStreetMap, sem chave de API.',
          'Adapters isolados para troca futura de provedor: p-mapa.js (renderização) e g-geo.js (geocodificação).',
          'Coordenada lida do Excel quando disponível; arquivos antigos sem lat/lng caem no geocode na hora.',
          'Correção: imóvel importado agora fica público automaticamente no Drive (antes nascia privado e não aparecia no portal).',
          'Código reorganizado em módulos coesos: p-import.js (importação), p-acoes.js (ações da ficha) e p-mapa.js + g-geo.js (mapa) — facilita manutenção e troca de sistema.',
          'Changelog unificado em g-changelog.html (Ficha e Portal em accordions); p-changelog.html e f-changelog.html removidos.',
          'Helper mostrarToastPendente() elimina duplicação do toast de redirecionamento entre páginas.',
        ]
      }
    ]
  },
  {
    versao: '0.6.2',
    data:   '05/Jun/2026',
    titulo: 'Refatoração estrutural e sidebar na ficha',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Sidebar lateral adicionada à Ficha Técnica (f-ficha.html) — mesma navegação do portal.',
          'Versão da ficha exibida no badge da sidebar ao acessar f-ficha.html.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'Pastas portal/ e ficha/ eliminadas — todos os arquivos movidos para a raiz com prefixos f-, p- e g-.',
          'global.css renomeado para css/g-global.css.',
          'URL do JSON de domínios corrigida para caminho relativo (não depende mais do push para funcionar localmente).',
          'g-versao.js criado unificando f-versao.js e p-versao.js (Fase 4).',
          'DEPS.md adicionado: mapa completo de dependências entre arquivos.',
        ]
      }
    ]
  },
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

/* ── CHANGELOG DA FICHA ──────────────────────────────────── */
const CHANGELOG = [
  {
    versao: '0.7.0',
    data:   '08/Jun/2026',
    titulo: 'Geocodificação automática no cadastro',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Ao digitar o CEP, a ficha busca as coordenadas do endereço em segundo plano — sem travar o preenchimento.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'Latitude e Longitude gravadas no Excel exportado (linhas de Localização), para o mapa do portal ler direto.',
          'Geocodificação via Nominatim/OpenStreetMap, isolada no adapter g-geo.js (troca de provedor sem mexer na ficha).',
          'Best-effort: se a geocodificação falhar, o Excel é exportado normalmente, sem coordenada.',
        ]
      }
    ]
  },
  {
    versao: '0.6.2',
    data:   '05/Jun/2026',
    titulo: 'Sidebar na ficha e refatoração estrutural',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Menu lateral (sidebar) adicionado à Ficha Técnica — mesma navegação do portal.',
        ]
      },
      {
        categoria: 'Sistema & Código',
        itens: [
          'f-ficha.html movido da pasta ficha/ para a raiz do repositório.',
          'URL do JSON de domínios corrigida para caminho relativo.',
        ]
      }
    ]
  },
  {
    versao: '0.6.1',
    data:   '05/Jun/2026',
    titulo: 'Complemento padronizado e validação visual',
    grupos: [
      {
        categoria: 'Interface & Funcionalidades',
        itens: [
          'Campo Complemento substituído por select (Apartamento, Casa, Lote, Sala, Bloco, Andar, Conjunto) + número — monta o valor final automaticamente (ex: Apartamento 13).',
          'CEP e Número destacados com borda vermelha quando estão vazios após o usuário adicionar um cômodo.',
        ]
      }
    ]
  },
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

/* ── FUNÇÕES DE NAVEGAÇÃO ────────────────────────────────── */
/* Ambas apontam para o changelog unificado (g-changelog.html).
   Mantidas separadas por compatibilidade com quem já as chama. */
function abrirChangelog() {
  window.location.href = 'g-changelog.html';
}

function abrirChangelogPortal() {
  window.location.href = 'g-changelog.html';
}

/* ================================================================
   RASCUNHO — staging area da sessão atual
   Preenchido pelo executor (Claude) e pelo censor-subagent.
   Lido pelo terminus-subagent ao fechar a versão.

   terminus sempre pode fazer commit + push (independente do recheio).
   Com recheio + bump: escreve entrada no CHANGELOG_GERAL, bumpa versões, apaga recheio, commita, push.
   Sem recheio (ou sem bump): pula a parte do changelog e vai direto para commit + push.
   Nova entrada do CHANGELOG_GERAL é inserida ACIMA desta seção.
   ================================================================ */

/* >> RASCUNHO_INICIO

const RASCUNHO = {
  titulo: '',
  interface: [],
  sistema: [],
};

RASCUNHO_FIM << */
