/* arquivo: p-import.js | versao: 0.7.1 */
/* ============================================================
   p-import.js — Pipeline de importação de Excel (Portal)

   Agrupa acionarImportacao() + processarArquivo(), antes duplicados
   em index.html e cadastro.html. A lógica pesada (parse → valida →
   duplicata → salva) fica aqui; cada página define o que fazer ao
   concluir através do hook aoImportarComSucesso(existente).

   Depende de: parsearExcel [p-parser.js] · checkDuplicata, saveImovel
   [p-storage.js] · mostrarToast, abrirModalDuplicata, formatarEndereco
   [p-ui.js].
   ============================================================ */

/** Abre o seletor de arquivo (input#input-excel deve existir na página). */
function acionarImportacao() {
  const input = document.getElementById('input-excel');
  if (!input) return;
  input.value = '';
  input.click();
}

/**
 * Valida, deduplica e salva o Excel no Drive.
 * Ao concluir com sucesso, chama o hook aoImportarComSucesso(existente)
 * se a página o tiver definido — é lá que cada página decide se recarrega
 * a lista, redireciona, etc.
 * @param {Event} evento — change do input[type=file]
 */
async function processarArquivo(evento) {
  const arquivo = evento.target.files[0];
  if (!arquivo) return;

  mostrarToast('Validando arquivo…', '', '⏳');

  try {
    /* Parseia e valida — lança erro se não for ficha legítima */
    const imovel = await parsearExcel(arquivo);

    if (!imovel.id || imovel.id === '__') {
      mostrarToast('Arquivo inválido: CEP ou Número não encontrado.', 'erro', '❌');
      return;
    }

    /* Verifica duplicata (CEP + Número + Complemento) */
    const existente = await checkDuplicata(
      imovel.localizacao['CEP']         || '',
      imovel.localizacao['Número']      || imovel.localizacao['Numero'] || '',
      imovel.localizacao['Complemento'] || ''
    );

    if (existente) {
      const confirmar = await abrirModalDuplicata(formatarEndereco(existente.localizacao));
      if (!confirmar) {
        mostrarToast('Importação cancelada.', 'aviso', '⚠️');
        return;
      }
    }

    mostrarToast('Enviando para o Drive…', '', '☁️');
    await saveImovel(arquivo, imovel);

    /* Cada página decide o que fazer ao concluir */
    if (typeof aoImportarComSucesso === 'function') {
      aoImportarComSucesso(!!existente);
    }

  } catch (erro) {
    console.error('[import] Erro na importação:', erro);
    mostrarToast(erro.message || 'Erro inesperado na importação.', 'erro', '❌');
  }
}
