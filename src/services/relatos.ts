import type { Relato } from '@/data/types';
import { inserirRelato, marcarRelatoEnviado } from '@/db/database';
import { enviarRelato } from '@/services/api';

type NovoRelato = Pick<Relato, 'ruaId' | 'ruaNome' | 'categoria' | 'descricao'>;

const toPayload = (r: Pick<Relato, 'ruaId' | 'ruaNome' | 'categoria' | 'descricao' | 'criadoEm'>) => ({
  ruaId: r.ruaId,
  ruaNome: r.ruaNome,
  categoria: r.categoria,
  descricao: r.descricao,
  criadoEm: r.criadoEm,
});

/** Tenta enviar e, se der certo, marca como enviado no banco local. Retorna se o envio funcionou. */
export async function sincronizarRelato(r: Relato): Promise<boolean> {
  try {
    await enviarRelato(toPayload(r));
    await marcarRelatoEnviado(r.id);
    return true;
  } catch {
    return false;
  }
}

/**
 * 1) Sempre grava no banco local, para não perder o relato sem internet.
 * 2) Tenta enviar; se falhar, o relato fica "pendente" em Meus relatos.
 * Só lança erro se não conseguir salvar no celular.
 */
export async function criarRelato(novo: NovoRelato): Promise<{ relato: Relato; enviado: boolean }> {
  const relato = await inserirRelato(novo);
  const enviado = await sincronizarRelato(relato);
  return { relato: enviado ? { ...relato, status: 'enviado' } : relato, enviado };
}
