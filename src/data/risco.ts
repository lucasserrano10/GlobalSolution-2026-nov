import type { Risco, Rua } from '@/data/types';

export const riscoPeso: Record<Risco, number> = { baixo: 0, atencao: 1, alto: 2, critico: 3 };

export function piorRisco(ruas: Rua[]): Risco {
  return ruas.reduce<Risco>((pior, r) => (riscoPeso[r.risco] > riscoPeso[pior] ? r.risco : pior), 'baixo');
}
