"""
scripts/migrar-drive.py
Migra os arquivos .xlsx do Google Drive local para incluir o grupo
"Informações Técnicas" (Tipo de Imóvel + áreas) separado de "Localização".

Uso:
  python scripts/migrar-drive.py            — migra todos os arquivos
  python scripts/migrar-drive.py --dry-run  — simula sem alterar nada

Requer: pip install pandas openpyxl
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')

import os
import glob
import shutil
import pandas as pd

PASTA = r'G:\Meu Drive\zillow-br-imoveis'

# Com e sem acento — o parser do portal aceita os dois
NOMES_IMOVEL = {'Imóvel', 'Imovel'}

CAMPOS_TECNICOS = {
    'Tipo de Imóvel',
    'Área do terreno (m²)',
    'Área privativa (m²)',
    'Área útil (m²)',
    'Área comum — fração ideal (m²)',
    'Fração ideal (%)',
    'Área total (m²)',
    'Area total (m2)',   # variante sem acento/expoente (tolerância)
}


def migrar(caminho, dry_run=False):
    nome = os.path.basename(caminho)
    df = pd.read_excel(caminho, header=0, dtype=str).fillna('')

    # Valida estrutura: exatamente 4 colunas
    if df.shape[1] != 4:
        print(f'  ERRO  {nome} — esperadas 4 colunas, encontradas {df.shape[1]}')
        return
    df.columns = ['Comodo', 'Grupo', 'Caracteristica', 'Valor']

    # Já migrado?
    if (df['Grupo'] == 'Informações Técnicas').any():
        print(f'  SKIP  {nome} — já tem Informações Técnicas')
        return

    # Campos técnicos que estão em Localização → mover para Informações Técnicas
    mask_it = (
        df['Comodo'].isin(NOMES_IMOVEL) &
        df['Caracteristica'].isin(CAMPOS_TECNICOS) &
        (df['Valor'] != '')
    )
    linhas_it = df[mask_it].copy().assign(Grupo='Informações Técnicas')
    df_base   = df[~mask_it].reset_index(drop=True)

    # Se o arquivo original não tem nenhuma área técnica, estima pela soma das áreas dos cômodos.
    # Verifica no df original (não em linhas_it) para não disparar quando só 'Tipo de Imóvel' foi movido.
    area_ja_encontrada = (
        df['Comodo'].isin(NOMES_IMOVEL) &
        df['Caracteristica'].str.startswith('Área') &
        (df['Valor'] != '')
    ).any()
    if not area_ja_encontrada:
        mask_area = (
            ~df['Comodo'].isin({'', 'Anunciante', *NOMES_IMOVEL}) &
            df['Caracteristica'].isin(CAMPOS_TECNICOS)
        )
        total = pd.to_numeric(df.loc[mask_area, 'Valor'], errors='coerce').sum()
        if total > 0:
            linhas_it = pd.concat([linhas_it, pd.DataFrame([{
                'Comodo':        'Imóvel',
                'Grupo':         'Informações Técnicas',
                'Caracteristica': 'Área total estimada (m²)',
                'Valor':         f'{total:.2f}',
            }])], ignore_index=True)

    if linhas_it.empty:
        print(f'  SKIP  {nome} — sem dados técnicos para adicionar')
        return

    # Insere antes da primeira linha "Imóvel"
    idx = df_base[df_base['Comodo'].isin(NOMES_IMOVEL)].index
    pos = int(idx[0]) if len(idx) > 0 else len(df_base)

    df_final = pd.concat(
        [df_base.iloc[:pos], linhas_it, df_base.iloc[pos:]],
        ignore_index=True
    )

    if dry_run:
        print(f'  SIMUL {nome} — adicionaria:')
        for _, row in linhas_it.iterrows():
            print(f'        {row.Caracteristica}: {row.Valor}')
        return

    # Backup → salva → remove backup (restaura se falhar)
    backup = caminho + '.bak'
    if os.path.exists(backup):
        # Backup órfão indica que uma gravação anterior foi interrompida.
        # O .bak pode ser a cópia boa — não sobrescrever. Investigar manualmente.
        print(f'  AVISO {nome} — backup órfão encontrado: {os.path.basename(backup)}')
        print(f'        Se o arquivo parece corrompido, restaure o .bak manualmente e rode novamente.')
        return
    shutil.copy2(caminho, backup)
    try:
        df_final.to_excel(caminho, index=False, engine='openpyxl')
        os.remove(backup)
        print(f'  OK    {nome}')
        for _, row in linhas_it.iterrows():
            print(f'        {row.Caracteristica}: {row.Valor}')
    except Exception as e:
        shutil.copy2(backup, caminho)
        os.remove(backup)
        raise RuntimeError(f'Falha ao salvar — arquivo restaurado. Detalhe: {e}')


# ── Main ──────────────────────────────────────────────────────────────────────
dry_run = '--dry-run' in sys.argv

if not os.path.isdir(PASTA):
    print(f'ERRO: pasta não encontrada:\n  {PASTA}')
    print('Verifique se o Google Drive Desktop está sincronizado.')
    sys.exit(1)

prefixo = '[DRY RUN] ' if dry_run else ''
print(f'{prefixo}Migrando imóveis em {PASTA}\n')

arquivos = sorted(
    glob.glob(os.path.join(PASTA, 'FT_*.xlsx')) +
    glob.glob(os.path.join(PASTA, 'FT_*.xlsm'))
)

if not arquivos:
    print('Nenhum arquivo FT_*.xlsx encontrado na pasta.')
    sys.exit(0)

print(f'{len(arquivos)} arquivo(s) encontrado(s)\n')

for arq in arquivos:
    try:
        migrar(arq, dry_run=dry_run)
    except Exception as e:
        print(f'  ERRO  {os.path.basename(arq)}: {e}')

print('\nConcluído.')
