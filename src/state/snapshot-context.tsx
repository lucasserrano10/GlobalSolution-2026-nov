import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { alternarFavorita, listarFavoritas } from '@/db/database';
import type { Cenario, Snapshot } from '@/data/types';
import { getSnapshot } from '@/services/api';

interface SnapshotCtx {
  cenario: Cenario;
  setCenario: (c: Cenario) => void;
  snapshot: Snapshot | null;
  loading: boolean;
  erro: boolean;
  recarregar: () => void;
  favoritas: string[];
  alternarFavorita: (ruaId: string) => Promise<void>;
}

const Ctx = createContext<SnapshotCtx | null>(null);

export function SnapshotProvider({ children }: { children: ReactNode }) {
  const [cenario, setCenarioState] = useState<Cenario>('previsao');
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [tick, setTick] = useState(0);
  const [favoritas, setFavoritas] = useState<string[]>([]);

  useEffect(() => {
    let ativo = true;
    getSnapshot(cenario)
      .then((s) => {
        if (!ativo) return;
        setSnapshot(s);
        setErro(false);
      })
      .catch(() => ativo && setErro(true))
      .finally(() => ativo && setLoading(false));
    return () => {
      ativo = false;
    };
  }, [cenario, tick]);

  useEffect(() => {
    listarFavoritas().then(setFavoritas).catch(() => setFavoritas([]));
  }, []);

  const setCenario = useCallback((c: Cenario) => {
    setLoading(true);
    setCenarioState(c);
  }, []);

  const recarregar = useCallback(() => {
    setLoading(true);
    setTick((t) => t + 1);
  }, []);

  const alternar = useCallback(async (ruaId: string) => {
    const agora = await alternarFavorita(ruaId);
    setFavoritas((f) => (agora ? [...f, ruaId] : f.filter((x) => x !== ruaId)));
  }, []);

  const value = useMemo(
    () => ({ cenario, setCenario, snapshot, loading, erro, recarregar, favoritas, alternarFavorita: alternar }),
    [cenario, setCenario, snapshot, loading, erro, recarregar, favoritas, alternar],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSnapshot(): SnapshotCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSnapshot deve ser usado dentro de SnapshotProvider');
  return v;
}
