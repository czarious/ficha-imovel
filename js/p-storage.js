/* arquivo: p-storage.js | versao: 0.7.1 */
/* ============================================================
   p-storage.js — Gerenciamento de dados via Google Drive API
   Zillow BR Portal | Responsabilidade: CRUD de imóveis no Drive
   Depende de: g-config.js (DRIVE_PASTA_ID, DRIVE_API_KEY, OAUTH_CLIENT_ID)
   ============================================================ */

/* ----------------------------------------------------------------
   ESTADO DE AUTENTICAÇÃO
   ---------------------------------------------------------------- */
let _tokenAcesso    = null;  // token OAuth para operações de escrita
let _clienteGoogle  = null;  // instância do Google Identity Services

/**
 * Inicializa o cliente OAuth do Google Identity Services.
 * Chamado uma vez ao carregar a página.
 */
function inicializarOAuth() {
  if (typeof google === 'undefined' || !google.accounts) return;
  _clienteGoogle = google.accounts.oauth2.initTokenClient({
    client_id: OAUTH_CLIENT_ID,
    scope:     OAUTH_ESCOPOS,
    callback:  (resposta) => {
      if (resposta.error) {
        console.error('[storage] Erro OAuth:', resposta.error);
        return;
      }
      _tokenAcesso = resposta.access_token;
    }
  });
}

/**
 * Solicita token OAuth ao usuário (abre popup de login Google).
 * Retorna Promise que resolve quando o token estiver disponível.
 * @returns {Promise<string>} token de acesso
 */
function solicitarToken() {
  return new Promise((resolve, reject) => {
    if (_tokenAcesso) { resolve(_tokenAcesso); return; }
    if (!_clienteGoogle) { reject(new Error('Cliente OAuth não inicializado.')); return; }

    const clienteComCallback = google.accounts.oauth2.initTokenClient({
      client_id: OAUTH_CLIENT_ID,
      scope:     OAUTH_ESCOPOS,
      callback:  (resposta) => {
        if (resposta.error) { reject(new Error(resposta.error)); return; }
        _tokenAcesso = resposta.access_token;
        resolve(_tokenAcesso);
      }
    });
    clienteComCallback.requestAccessToken({ prompt: 'consent' });
  });
}

/* ----------------------------------------------------------------
   LEITURA — pública, usa API Key
   ---------------------------------------------------------------- */

/**
 * Lista todos os arquivos .xlsx/.xlsm na pasta do Drive.
 * Leitura pública — não requer login.
 * @returns {Promise<Array>} lista de objetos { id, name }
 */
async function listarArquivosDrive() {
  const url = `https://www.googleapis.com/drive/v3/files?`
    + `q='${DRIVE_PASTA_ID}'+in+parents+and+trashed=false`
    + `&fields=files(id,name)`
    + `&key=${DRIVE_API_KEY}`;

  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Erro ao listar arquivos do Drive.');
  const dados = await resp.json();
  return dados.files || [];
}

/**
 * Baixa e parseia um arquivo .xlsx do Drive pelo ID do arquivo.
 * @param {string} fileId — ID do arquivo no Drive
 * @param {string} fileName — nome do arquivo (para validação)
 * @returns {Promise<Object>} objeto imóvel
 */
async function baixarArquivoDrive(fileId, fileName) {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${DRIVE_API_KEY}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Erro ao baixar arquivo ${fileName}.`);
  const blob = await resp.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return parsearExcel(file);
}

/**
 * Retorna todos os imóveis da pasta Drive.
 * Fonte de dados principal — lê direto do Google Drive.
 * @returns {Promise<Array<Object>>}
 */
async function getImoveis() {
  try {
    const arquivos = await listarArquivosDrive();
    const promessas = arquivos
      .filter(f => EXCEL_EXTENSOES.some(e => f.name.toLowerCase().endsWith(e)))
      .map(f => baixarArquivoDrive(f.id, f.name).catch(() => null));
    const resultados = await Promise.all(promessas);
    return resultados.filter(Boolean);
  } catch (e) {
    console.error('[storage] Erro ao carregar imóveis:', e);
    return [];
  }
}

/**
 * Retorna um imóvel pelo ID ou null se não encontrado.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
async function getImovelById(id) {
  const imoveis = await getImoveis();
  return imoveis.find(i => i.id === id) || null;
}

/* ----------------------------------------------------------------
   ESCRITA — requer autenticação OAuth
   ---------------------------------------------------------------- */

/**
 * Faz upload de um arquivo .xlsx para a pasta Drive.
 * Requer token OAuth — solicita login se necessário.
 * @param {File} arquivo — objeto File original do input
 * @param {string} nomeArquivo — nome canônico do arquivo
 * @returns {Promise<string>} ID do arquivo criado no Drive
 */
async function uploadArquivoDrive(arquivo, nomeArquivo) {
  const token = await solicitarToken();

  const metadata = JSON.stringify({
    name:    nomeArquivo,
    parents: [DRIVE_PASTA_ID]
  });

  const form = new FormData();
  form.append('metadata', new Blob([metadata], { type: 'application/json' }));
  form.append('file', arquivo);

  const resp = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
      body:    form
    }
  );

  if (!resp.ok) throw new Error('Erro ao fazer upload para o Drive.');
  const dados = await resp.json();

  /* Arquivos enviados via OAuth nascem privados. Sem isto, a leitura
     pública via API Key retorna 403 e o card não aparece no portal. */
  await tornarArquivoPublico(dados.id, token);

  return dados.id;
}

/**
 * Marca um arquivo do Drive como público (qualquer pessoa com o link = leitor).
 * Permite que o portal leia o conteúdo via API Key, sem exigir login do visitante.
 * @param {string} driveFileId — ID do arquivo no Drive
 * @param {string} token — token OAuth já obtido em uploadArquivoDrive
 */
async function tornarArquivoPublico(driveFileId, token) {
  const resp = await fetch(
    `https://www.googleapis.com/drive/v3/files/${driveFileId}/permissions`,
    {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'reader', type: 'anyone' })
    }
  );
  if (!resp.ok) throw new Error('Erro ao tornar o arquivo público no Drive.');
}

/**
 * Salva ou atualiza um imóvel no Drive.
 * Se já existir arquivo com mesmo nome, deleta e faz novo upload.
 * @param {File} arquivoOriginal — arquivo .xlsx do input
 * @param {Object} imovel — objeto imóvel já parseado
 */
async function saveImovel(arquivoOriginal, imovel) {
  const nomeArquivo = arquivoOriginal.name;

  // Verifica se já existe arquivo com mesmo nome e deleta
  const arquivos = await listarArquivosDrive();
  const existente = arquivos.find(f => f.name === nomeArquivo);
  if (existente) {
    await deletarArquivoDrive(existente.id);
  }

  await uploadArquivoDrive(arquivoOriginal, nomeArquivo);
}

/**
 * Deleta um arquivo do Drive pelo ID do arquivo no Drive.
 * @param {string} driveFileId — ID do arquivo no Drive
 */
async function deletarArquivoDrive(driveFileId) {
  const token = await solicitarToken();
  const resp = await fetch(
    `https://www.googleapis.com/drive/v3/files/${driveFileId}`,
    {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  if (!resp.ok && resp.status !== 204) throw new Error('Erro ao deletar arquivo do Drive.');
}

/**
 * Deleta um imóvel pelo ID canônico (CEP+Numero+Complemento).
 * Busca o arquivo correspondente na pasta e deleta.
 * @param {string} id — ID canônico do imóvel
 */
async function deleteImovel(id) {
  const arquivos = await listarArquivosDrive();
  // O nome do arquivo começa com FT_ e contém o ID canônico
  const arquivo = arquivos.find(f => {
    const nomeBase = f.name.replace(/\.(xlsx|xlsm)$/i, '');
    const partes   = nomeBase.split('_').slice(1); // remove prefixo FT
    const idArquivo = normalizarId(partes[0] || '', partes[1] || '', partes[2] || '');
    return idArquivo === id;
  });
  if (arquivo) await deletarArquivoDrive(arquivo.id);
}

/* ----------------------------------------------------------------
   DEDUPLICAÇÃO
   ---------------------------------------------------------------- */

/**
 * Verifica se já existe imóvel com mesmo CEP + Número + Complemento.
 * @param {string} cep
 * @param {string} numero
 * @param {string} complemento
 * @returns {Promise<Object|null>}
 */
async function checkDuplicata(cep, numero, complemento) {
  const id = normalizarId(cep, numero, complemento);
  return getImovelById(id);
}

/* ----------------------------------------------------------------
   HELPERS
   ---------------------------------------------------------------- */

/**
 * Gera um ID canônico a partir de CEP + Número + Complemento.
 * @param {string} cep
 * @param {string} numero
 * @param {string} complemento
 * @returns {string}
 */
function normalizarId(cep, numero, complemento) {
  const limpar = str =>
    (str || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

  return `${limpar(cep)}_${limpar(numero)}_${limpar(complemento)}`;
}
