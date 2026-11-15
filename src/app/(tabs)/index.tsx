import { StyleSheet, View } from 'react-native';

import { CenarioPicker } from '@/components/cenario-picker';
import { RuaCard } from '@/components/rua-card';
import { SituacaoHero } from '@/components/situacao-hero';
import { SnapshotBoundary } from '@/components/snapshot-boundary';
import { StatsRow } from '@/components/stats-row';
import { Grid, Notice, Screen, SectionHeader } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { piorRisco, riscoPeso } from '@/data/risco';
import { useSnapshot } from '@/state/snapshot-context';

export default function Inicio() {
  const { cenario, setCenario, favoritas, alternarFavorita, recarregar, loading, snapshot } = useSnapshot();

  return (
    <Screen onRefresh={recarregar} refreshing={loading && !!snapshot}>
      <SnapshotBoundary>
        {(s) => {
          const ruas = [...s.ruas].sort(
            (a, b) =>
              Number(favoritas.includes(b.id)) - Number(favoritas.includes(a.id)) || riscoPeso[b.risco] - riscoPeso[a.risco],
          );
          const obstruidas = s.ruas.reduce((n, r) => n + r.bocasObstruidas, 0);
          const emRisco = s.ruas.filter((r) => riscoPeso[r.risco] >= riscoPeso.alto).length;

          return (
            <>
              <SituacaoHero snapshot={s} piorRisco={piorRisco(s.ruas)} />

              <StatsRow
                items={[
                  { value: String(emRisco), label: 'Ruas em risco alto' },
                  { value: String(obstruidas), label: 'Bocas obstruídas' },
                  { value: String(s.quadras.filter((q) => q.acessoTravado).length), label: 'Quadras travadas' },
                ]}
              />

              {s.quadras.some((q) => q.acessoTravado) && (
                <Notice tone="warning" icon="lock-closed" title="Acesso às quadras travado">
                  Por segurança, não entre nas quadras durante a chuva.
                </Notice>
              )}

              <View style={styles.section}>
                <SectionHeader title="Ruas do bairro" subtitle="Toque numa rua para ver os detalhes. Use a estrela para fixar as suas no topo." />
                <Grid>
                  {ruas.map((r) => (
                    <RuaCard key={r.id} rua={r} favorita={favoritas.includes(r.id)} onToggleFavorita={() => alternarFavorita(r.id)} />
                  ))}
                </Grid>
              </View>
            </>
          );
        }}
      </SnapshotBoundary>

      {/* O seletor fica fora da barreira: continua acessível mesmo se o carregamento falhar. */}
      {(snapshot || !loading) && <CenarioPicker cenario={cenario} onChange={setCenario} />}
    </Screen>
  );
}

const styles = StyleSheet.create({ section: { gap: spacing.md } });
