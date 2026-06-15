/* arquivo: p-parser.js | versao: 0.7.3 */
/* ============================================================
   p-parser.js — Leitura e validação do arquivo .xlsx gerado pela Ficha Técnica
   Depende de: SheetJS (XLSX) carregado antes deste arquivo
               p-storage.js (função normalizarId)
               g-config.js (constantes do app)
   Estrutura esperada: Cômodo | Grupo | Característica | Valor
   ============================================================ */

/**
 * Valida se o arquivo é uma ficha legítima do Zillow BR.
 * Qualquer falha lança erro com mensagem genérica — não entrega o roteiro.
 * @param {File} arquivo
 * @param {Array<Array<string>>} linhas — conteúdo já parseado pelo SheetJS
 */
function validarArquivo(arquivo, linhas) {
  const erro = () => { throw new Error(APP_MENSAGEM_ERRO_IMPORT); };

  /* ---- 1. Nome do arquivo ---- */
  const nome = arquivo.name || '';
  const nomeUpper = nome.toUpperCase();
  const temPrefixo   = nomeUpper.startsWith(EXCEL_PREFIXO.toUpperCase());
  const temExtensao  = EXCEL_EXTENSOES.some(e => nome.toLowerCase().endsWith(e));
  const temSeparador = (nome.match(/_/g) || []).length >= 2;
  if (!temPrefixo || !temExtensao || !temSeparador) erro();

  /* ---- 2. Colunas obrigatórias — primeira linha não vazia ---- */
  const cabecalho = linhas.find(l => l.some(c => String(c).trim() !== ''));
  if (!cabecalho) erro();
  const cols = cabecalho.map(c => String(c).trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  const colsEsperadas = ['comodo', 'grupo', 'caracteristica', 'valor'];
  if (!colsEsperadas.every(c => cols.includes(c))) erro();

  /* ---- 3. Linha Anunciante ---- */
  const temAnunciante = linhas.some(l => String(l[0]).trim() === 'Anunciante');
  if (!temAnunciante) erro();

  /* ---- 4. Linha Imóvel ---- */
  const temImovel = linhas.some(l =>
    String(l[0]).trim() === 'Imóvel' || String(l[0]).trim() === 'Imovel'
  );
  if (!temImovel) erro();

  /* ---- 5. CEP preenchido ---- */
  const linhasCep = linhas.filter(l =>
    (String(l[0]).trim() === 'Imóvel' || String(l[0]).trim() === 'Imovel') &&
    String(l[2]).trim() === 'CEP'
  );
  const temCep = linhasCep.some(l => String(l[3]).trim() !== '');
  if (!temCep) erro();

  /* ---- 6. Ao menos um cômodo ---- */
  const temComodo = linhas.some(l => {
    const colA = String(l[0]).trim();
    return colA !== '' && colA !== 'Anunciante' &&
           colA !== 'Imóvel' && colA !== 'Imovel' &&
           colA.toLowerCase() !== 'comodo' && colA.toLowerCase() !== 'cômodo';
  });
  if (!temComodo) erro();
}

/**
 * Lê um arquivo .xlsx e retorna um objeto imóvel estruturado.
 * @param {File} arquivo — objeto File do input[type=file]
 * @returns {Promise<Object>} — Promise que resolve com o objeto imóvel
 */
function parsearExcel(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.onload = (evento) => {
      try {
        const arrayBuffer = new Uint8Array(evento.target.result);

        // SheetJS: lê o workbook a partir do array de bytes
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        // Sempre usa a primeira aba
        const nomePlanilha = workbook.SheetNames[0];
        const planilha = workbook.Sheets[nomePlanilha];

        // Converte para array de arrays; defval='' preenche células vazias
        const linhas = XLSX.utils.sheet_to_json(planilha, {
          header: 1,
          defval: '',
          raw: false // converte tudo para string
        });

        // Valida antes de montar — rejeita se não for ficha legítima
        validarArquivo(arquivo, linhas);

        const imovel = montarObjetoImovel(linhas);
        resolve(imovel);

      } catch (erro) {
        reject(erro);
      }
    };

    leitor.onerror = () => reject(new Error('Erro ao ler o arquivo. Verifique se é um .xlsx válido.'));
    leitor.readAsArrayBuffer(arquivo);
  });
}

/**
 * Converte o array de linhas da planilha no objeto imóvel canônico.
 *
 * Linhas com célula A = "Anunciante" → imovel.anunciante
 * Linhas com célula A = "Imóvel"     → imovel.grupos[Grupo] (+ atalho em imovel.localizacao para o grupo Localização)
 * Demais linhas                      → imovel.comodos (agrupados por nome)
 *
 * @param {Array<Array<string>>} linhas
 * @returns {Object}
 */
function montarObjetoImovel(linhas) {
  const imovel = {
    id:          null,
    anunciante:  {},
    grupos:      {},   // dados do Imóvel agrupados dinamicamente pela coluna Grupo
    localizacao: {},   // atalho para grupos['Localização'] — uso interno (cards, geocod., dedup.)
    comodos:     [],
    importadoEm: new Date().toISOString()
  };

  const mapaComodos  = {};
  const ordemComodos = [];
  const ordemGrupos  = {};

  for (const linha of linhas) {
    const [colA, colB, colC, colD] = linha.map(c => String(c).trim());

    if (!colA) continue;
    const colALower = colA.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (colALower === 'comodo') continue; // cabeçalho

    if (!colB || !colC) continue;

    const valor = colD;

    /* ---- 1. Anunciante ---- */
    if (colA === 'Anunciante') {
      imovel.anunciante[colC] = valor;
      continue;
    }

    /* ---- 2. Imóvel — roteia dinamicamente pelo Grupo ---- */
    if (colA === 'Imóvel' || colA === 'Imovel') {
      if (!imovel.grupos[colB]) imovel.grupos[colB] = {};
      imovel.grupos[colB][colC] = valor;
      if (colB === 'Localização' || colB === 'Localizacao') {
        imovel.localizacao[colC] = valor;
      }
      continue;
    }

    /* ---- 3. Cômodos ---- */
    const nomeComodo = colA;
    const nomeGrupo  = colB;

    if (!mapaComodos[nomeComodo]) {
      mapaComodos[nomeComodo] = {};
      ordemComodos.push(nomeComodo);
      ordemGrupos[nomeComodo] = [];
    }

    if (!mapaComodos[nomeComodo][nomeGrupo]) {
      mapaComodos[nomeComodo][nomeGrupo] = {};
      ordemGrupos[nomeComodo].push(nomeGrupo);
    }

    mapaComodos[nomeComodo][nomeGrupo][colC] = valor;
  }

  /* ---- Converte o mapa para o array de cômodos ---- */
  for (const nomeComodo of ordemComodos) {
    const grupos = [];

    for (const nomeGrupo of ordemGrupos[nomeComodo]) {
      const atributos = mapaComodos[nomeComodo][nomeGrupo];
      const itens = Object.entries(atributos)
        .map(([caracteristica, valor]) => ({ caracteristica, valor }))
        .filter(item => item.valor !== '');

      if (itens.length > 0) {
        grupos.push({ nome: nomeGrupo, itens });
      }
    }

    if (grupos.length > 0) {
      imovel.comodos.push({ nome: nomeComodo, grupos });
    }
  }

  /* ---- Gera ID canônico para deduplicação ---- */
  const cep         = imovel.localizacao['CEP']         || '';
  const numero      = imovel.localizacao['Número']      || imovel.localizacao['Numero'] || '';
  const complemento = imovel.localizacao['Complemento'] || '';

  imovel.id = normalizarId(cep, numero, complemento);

  return imovel;
}
