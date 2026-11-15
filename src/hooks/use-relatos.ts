import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Relato } from '@/data/types';
import { excluirRelato, listarRelatos } from '@/db/database';
import { sincronizarRelato } from '@/services/relatos';

/** Lista os relatos salvos no celular e expõe as ações de reenviar e excluir. Recarrega ao focar a aba. */
export function useRelatos() {
  const [relatos, setRelatos] = useState<Relato[] | null>(null);
  const [erro, setErro] = useState(false);

  const carregar = useCallback(async () => {
    try {
      setRelatos(await listarRelatos());
      setErro(false);
    } catch {
      setErro(true);
      setRelatos((atual) => atual ?? []);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const reenviar = useCallback(
    async (r: Relato) => {
      const ok = await sincronizarRelato(r);
      if (ok) await carregar();
      return ok;
    },
    [carregar],
  );

  const excluir = useCallback(
    async (r: Relato) => {
      await excluirRelato(r.id);
      await carregar();
    },
    [carregar],
  );

  return { relatos, erro, carregar, reenviar, excluir };
}
