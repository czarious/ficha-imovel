/* ============================================================
   parser.js — Leitura do arquivo .xlsx gerado pela Ficha Técnica
   Depende de: SheetJS (XLSX) carregado antes deste arquivo
               storage.js (função normalizarId)
   Estrutura esperada: Cômodo | Grupo | Característica | Valor
   ============================================================ */

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

        const imovel = montarObjetoImovel(linhas);
        resolve(imovel);

      } catch (erro) {
        reject(new Error('Erro ao processar o Excel: ' + erro.message));
      }
    };

    leitor.onerror = () => reject(new Error('Erro ao ler o arquivo. Verifique se é um .xlsx válido.'));
    leitor.readAsArrayBuffer(arquivo);
  });
}

/**
 * Converte o array de linhas da planilha no objeto imóvel canônico.
 *
 * Linhas com célula A = "Cadastrante" → imovel.cadastrante
 * Linhas com célula A = "Imóvel"      → imovel.localizacao
 * Demais linhas                       → imovel.comodos (agrupados por nome)
 *
 * @param {Array<Array<string>>} linhas
 * @returns {Object}
 */
function montarObjetoImovel(linhas) {
  const imovel = {
    id:           null,      // gerado ao final
    cadastrante:  {},        // dados do cadastrante (flat)
    localizacao:  {},        // dados de localização (flat)
    comodos:      [],        // array de { nome, grupos: [{ nome, itens: [{caracteristica, valor}] }] }
    importadoEm:  new Date().toISOString()
  };

  // Mapa temporário para agrupar cômodos preservando ordem de inserção
  // Estrutura: { "Sala": { "Piso": { "Material": "Porcelanato" } } }
  const mapaComodos   = {};
  const ordemComodos  = []; // preserva ordem de aparição dos cômodos
  const ordemGrupos   = {}; // preserva ordem de aparição dos grupos por cômodo

  for (const linha of linhas) {
    // Extrai e limpa as 4 colunas esperadas
    const [colA, colB, colC, colD] = linha.map(c => String(c).trim());

    // Ignora cabeçalho textual e linhas completamente vazias
    if (!colA) continue;
    const colALower = colA.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (colALower === 'comodo' || colALower === 'comodo') continue; // cabeçalho

    // Ignora linhas sem grupo ou característica definidos
    if (!colB || !colC) continue;

    const valor = colD; // pode ser string vazia; a ficha não exporta linhas vazias

    /* ---- 1. Cadastrante ---- */
    if (colA === 'Cadastrante') {
      imovel.cadastrante[colC] = valor;
      continue;
    }

    /* ---- 2. Localização (cômodo "Imóvel") ---- */
    if (colA === 'Imóvel' || colA === 'Imovel') {
      imovel.localizacao[colC] = valor;
      continue;
    }

    /* ---- 3. Cômodos ---- */
    const nomeComodo = colA;
    const nomeGrupo  = colB;

    // Registra cômodo na ordem de aparição
    if (!mapaComodos[nomeComodo]) {
      mapaComodos[nomeComodo] = {};
      ordemComodos.push(nomeComodo);
      ordemGrupos[nomeComodo] = [];
    }

    // Registra grupo na ordem de aparição dentro do cômodo
    if (!mapaComodos[nomeComodo][nomeGrupo]) {
      mapaComodos[nomeComodo][nomeGrupo] = {};
      ordemGrupos[nomeComodo].push(nomeGrupo);
    }

    // Registra a característica (última escritura vence em duplicatas)
    mapaComodos[nomeComodo][nomeGrupo][colC] = valor;
  }

  /* ---- Converte o mapa para o array de cômodos ---- */
  for (const nomeComodo of ordemComodos) {
    const grupos = [];

    for (const nomeGrupo of ordemGrupos[nomeComodo]) {
      const atributos = mapaComodos[nomeComodo][nomeGrupo];
      const itens = Object.entries(atributos)
        .map(([caracteristica, valor]) => ({ caracteristica, valor }))
        .filter(item => item.valor !== ''); // descarta campos em branco

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
