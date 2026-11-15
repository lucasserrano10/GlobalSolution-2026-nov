import { QuadraCard } from '@/components/quadra-card';
import { SnapshotBoundary } from '@/components/snapshot-boundary';
import { Grid, Notice, Screen } from '@/components/ui';
import { useSnapshot } from '@/state/snapshot-context';

export default function Quadras() {
  const { recarregar, loading, snapshot } = useSnapshot();

  return (
    <Screen onRefresh={recarregar} refreshing={loading && !!snapshot}>
      <SnapshotBoundary>
        {(s) => (
          <>
            <Notice title="Como funcionam as quadras">
              Em dia seco são quadras esportivas. Na chuva forte viram reservatórios e o acesso é travado.
            </Notice>
            <Grid maxColumns={2}>
              {s.quadras.map((q) => (
                <QuadraCard key={q.id} quadra={q} />
              ))}
            </Grid>
          </>
        )}
      </SnapshotBoundary>
    </Screen>
  );
}
