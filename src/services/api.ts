import type { Cenario, Quadra, Relato, Risco, Rua, Snapshot } from '@/data/types';

/**
 * Se EXPO_PUBLIC_API_URL estiver definida, o app consome a API real:
 *   GET  {URL}/snapshot?cenario=seco|previsao|confirmado|durante
 *   POST {URL}/relatos
 * Caso contrário usa o mock local abaixo (dados SIMULADOS, sem dados pessoais).
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TIMEOUT_MS = 8000;

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- Mock ----------

const QUADRAS_BASE = [
  { id: 'q1', nome: 'Quadra Piloto Vila Esperança', endereco: 'R. das Acácias, s/n' },
  { id: 'q2', nome: 'Quadra do Parque Linear', endereco: 'Av. do Ribeirão, 410' },
];

type RuaBase = Pick<Rua, 'id' | 'nome' | 'bocasTotal' | 'quadraId'> & {
  risco: Record<Cenario, Risco>;
  obstruidas: Record<Cenario, number>;
  lamina: Record<Cenario, number>;
};

const RUAS_BASE: RuaBase[] = [
  {
    id: 'r1', nome: 'Rua das Acácias', bocasTotal: 12, quadraId: 'q1',
    risco: { seco: 'baixo', previsao: 'alto', confirmado: 'critico', durante: 'critico' },
    obstruidas: { seco: 4, previsao: 1, confirmado: 1, durante: 1 },
    lamina: { seco: 0, previsao: 0, confirmado: 0, durante: 18 },
  },
  {
    id: 'r2', nome: 'Av. do Ribeirão', bocasTotal: 15, quadraId: 'q2',
    risco: { seco: 'atencao', previsao: 'alto', confirmado: 'alto', durante: 'alto' },
    obstruidas: { seco: 5, previsao: 2, confirmado: 2, durante: 2 },
    lamina: { seco: 0, previsao: 0, confirmado: 0, durante: 9 },
  },
  {
    id: 'r3', nome: 'Rua Ipê Amarelo', bocasTotal: 8, quadraId: 'q1',
    risco: { seco: 'baixo', previsao: 'atencao', confirmado: 'atencao', durante: 'alto' },
    obstruidas: { seco: 1, previsao: 0, confirmado: 0, durante: 0 },
    lamina: { seco: 0, previsao: 0, confirmado: 0, durante: 4 },
  },
  {
    id: 'r4', nome: 'Rua do Córrego', bocasTotal: 10, quadraId: 'q2',
    risco: { seco: 'baixo', previsao: 'baixo', confirmado: 'atencao', durante: 'atencao' },
    obstruidas: { seco: 0, previsao: 0, confirmado: 0, durante: 0 },
    lamina: { seco: 0, previsao: 0, confirmado: 0, durante: 0 },
  },
];

const FASES: Record<Cenario, { titulo: string; descricao: string }> = {
  seco: {
    titulo: 'Tempo seco',
    descricao: 'Sem chuva forte prevista. As quadras estão liberadas para uso e os robôs inspecionam a rede.',
  },
  previsao: {
    titulo: 'Chuva forte em até 72 horas',
    descricao: 'Equipes estão limpando as bocas de lobo das ruas de maior risco. Evite descartar lixo na rua.',
  },
  confirmado: {
    titulo: 'Chuva confirmada em cerca de 2 horas',
    descricao: 'Quadras esvaziando e acesso sendo travado. Se puder, leve veículos e objetos para um local alto.',
  },
  durante: {
    titulo: 'Chuva forte em andamento',
    descricao: 'As quadras estão retendo a água do pico. Não entre nas quadras nem atravesse ruas alagadas.',
  },
};

function quadraEstado(c: Cenario): Pick<Quadra, 'estado' | 'ocupacaoPct' | 'acessoTravado'> {
  switch (c) {
    case 'seco': return { estado: 'uso', ocupacaoPct: 0, acessoTravado: false };
    case 'previsao': return { estado: 'uso', ocupacaoPct: 0, acessoTravado: false };
    case 'confirmado': return { estado: 'travada', ocupacaoPct: 0, acessoTravado: true };
    case 'durante': return { estado: 'retendo', ocupacaoPct: 72, acessoTravado: true };
  }
}

function mockSnapshot(cenario: Cenario): Snapshot {
  return {
    atualizadoEm: new Date().toISOString(),
    cenario,
    fase: FASES[cenario],
    ruas: RUAS_BASE.map((r) => ({
      id: r.id,
      nome: r.nome,
      bocasTotal: r.bocasTotal,
      quadraId: r.quadraId,
      risco: r.risco[cenario],
      bocasObstruidas: r.obstruidas[cenario],
      laminaCm: r.lamina[cenario],
    })),
    quadras: QUADRAS_BASE.map((q, i) => {
      const e = quadraEstado(cenario);
      return { ...q, ...e, ocupacaoPct: i === 0 ? e.ocupacaoPct : Math.round(e.ocupacaoPct * 0.6), capacidadeM3: 420 };
    }),
  };
}

// ---------- API pública do serviço ----------

export async function getSnapshot(cenario: Cenario): Promise<Snapshot> {
  if (API_URL) return fetchJson<Snapshot>(`${API_URL}/snapshot?cenario=${cenario}`);
  await delay(500);
  return mockSnapshot(cenario);
}

export async function enviarRelato(r: Omit<Relato, 'id' | 'status'>): Promise<void> {
  if (API_URL) {
    await fetchJson(`${API_URL}/relatos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(r),
    });
    return;
  }
  await delay(400);
}
