/* arquivo: p-config.js | versao: 0.6.2 */
/* ============================================================
   p-config.js — Configurações globais do Zillow BR · Portal
   Fonte única de verdade para constantes do negócio.
   Carregado antes de todos os outros scripts do portal.
   ============================================================ */

/* ---- Identidade do app ---- */
const APP_NOME        = 'Zillow BR';
const APP_FICHA       = 'Ficha Cadastral';
const APP_MENSAGEM_ERRO_IMPORT = 'Este arquivo não foi exportado pela Ficha Cadastral — Zillow BR. Verifique o arquivo e tente novamente.';

/* ---- Exportação Excel ---- */
const EXCEL_PREFIXO   = 'FT_';
const EXCEL_EXTENSOES = ['.xlsx', '.xlsm'];

/* ---- Google Drive ---- */
const DRIVE_PASTA_ID  = '1KXAeBciVmNMf0rkhBtSNvpSEuWvxgP-t';
const DRIVE_API_KEY   = 'AIzaSyAByaWsUts9ctHkVJ_OOiULR-6q_gvs-s4';

/* ---- Google OAuth 2.0 ---- */
const OAUTH_CLIENT_ID = '832827471837-plg29c5fp7li553vdgjmk0tf0gb1dfqd.apps.googleusercontent.com';
const OAUTH_ESCOPOS   = 'https://www.googleapis.com/auth/drive';
/* drive — acesso completo ao Drive do usuário logado.
   Necessário para fazer upload em pastas criadas manualmente. */
