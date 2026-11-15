export type Risco = 'baixo' | 'atencao' | 'alto' | 'critico';

/** Os quatro momentos do evento de chuva descritos na proposta. */
export type Cenario = 'seco' | 'previsao' | 'confirmado' | 'durante';

export type EstadoQuadra = 'uso' | 'esvaziando' | 'travada' | 'retendo';

export interface Rua {
  id: string;
  nome: string;
  risco: Risco;
  laminaCm: number;
  bocasTotal: number;
  bocasObstruidas: number;
  quadraId: string;
}

export interface Quadra {
  id: string;
  nome: string;
  endereco: string;
  estado: EstadoQuadra;
  ocupacaoPct: number;
  capacidadeM3: number;
  acessoTravado: boolean;
}

export interface Snapshot {
  atualizadoEm: string;
  cenario: Cenario;
  fase: { titulo: string; descricao: string };
  ruas: Rua[];
  quadras: Quadra[];
}

export type CategoriaRelato = 'boca_lobo' | 'rua_alagada' | 'lixo_galeria' | 'quadra';

export type StatusRelato = 'pendente' | 'enviado';

export interface Relato {
  id: number;
  ruaId: string;
  ruaNome: string;
  categoria: CategoriaRelato;
  descricao: string;
  criadoEm: string;
  status: StatusRelato;
}

export const categoriaLabel: Record<CategoriaRelato, string> = {
  boca_lobo: 'Boca de lobo entupida',
  rua_alagada: 'Rua alagada',
  lixo_galeria: 'Lixo ou sedimento na galeria',
  quadra: 'Problema na quadra',
};
