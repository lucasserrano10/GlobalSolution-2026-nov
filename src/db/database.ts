import * as SQLite from 'expo-sqlite';

import type { CategoriaRelato, Relato, StatusRelato } from '@/data/types';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Abre o banco local (SQLite) e cria as tabelas na primeira execução. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('quadraviva.db');
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS relatos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rua_id TEXT NOT NULL,
          rua_nome TEXT NOT NULL,
          categoria TEXT NOT NULL,
          descricao TEXT NOT NULL DEFAULT '',
          criado_em TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pendente'
        );
        CREATE TABLE IF NOT EXISTS ruas_favoritas (
          rua_id TEXT PRIMARY KEY NOT NULL
        );
      `);
      return db;
    })();
  }
  return dbPromise;
}

interface RelatoRow {
  id: number;
  rua_id: string;
  rua_nome: string;
  categoria: CategoriaRelato;
  descricao: string;
  criado_em: string;
  status: StatusRelato;
}

const toRelato = (r: RelatoRow): Relato => ({
  id: r.id,
  ruaId: r.rua_id,
  ruaNome: r.rua_nome,
  categoria: r.categoria,
  descricao: r.descricao,
  criadoEm: r.criado_em,
  status: r.status,
});

// ---------- Relatos (CRUD) ----------

export async function listarRelatos(): Promise<Relato[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<RelatoRow>('SELECT * FROM relatos ORDER BY id DESC');
  return rows.map(toRelato);
}

export async function inserirRelato(
  r: Pick<Relato, 'ruaId' | 'ruaNome' | 'categoria' | 'descricao'>,
): Promise<Relato> {
  const db = await getDb();
  const criadoEm = new Date().toISOString();
  const res = await db.runAsync(
    'INSERT INTO relatos (rua_id, rua_nome, categoria, descricao, criado_em, status) VALUES (?, ?, ?, ?, ?, ?)',
    r.ruaId,
    r.ruaNome,
    r.categoria,
    r.descricao,
    criadoEm,
    'pendente',
  );
  return { id: res.lastInsertRowId, status: 'pendente', criadoEm, ...r };
}

export async function marcarRelatoEnviado(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync("UPDATE relatos SET status = 'enviado' WHERE id = ?", id);
}

export async function excluirRelato(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM relatos WHERE id = ?', id);
}

// ---------- Ruas favoritas ----------

export async function listarFavoritas(): Promise<string[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ rua_id: string }>('SELECT rua_id FROM ruas_favoritas');
  return rows.map((r) => r.rua_id);
}

export async function alternarFavorita(ruaId: string): Promise<boolean> {
  const db = await getDb();
  const existe = await db.getFirstAsync<{ rua_id: string }>(
    'SELECT rua_id FROM ruas_favoritas WHERE rua_id = ?',
    ruaId,
  );
  if (existe) {
    await db.runAsync('DELETE FROM ruas_favoritas WHERE rua_id = ?', ruaId);
    return false;
  }
  await db.runAsync('INSERT INTO ruas_favoritas (rua_id) VALUES (?)', ruaId);
  return true;
}
