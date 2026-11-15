import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, EmptyState, Notice, Skeleton } from '@/components/ui';
import { spacing } from '@/constants/theme';
import type { Snapshot } from '@/data/types';
import { useSnapshot } from '@/state/snapshot-context';

function SkeletonCards() {
  return (
    <View style={styles.stack} accessible accessibilityLabel="Carregando dados do bairro" accessibilityLiveRegion="polite">
      <Card>
        <Skeleton width="40%" height={14} />
        <Skeleton width="85%" height={24} />
        <Skeleton height={14} />
        <Skeleton width="70%" height={14} />
      </Card>
      {[0, 1, 2].map((i) => (
        <Card key={i}>
          <Skeleton width="55%" height={20} />
          <Skeleton width="30%" height={26} />
          <Skeleton height={10} />
        </Card>
      ))}
    </View>
  );
}

/**
 * Cuida dos estados de carregamento e erro do snapshot e só renderiza o conteúdo quando há dados.
 * Se a atualização falhar mas houver dados anteriores, mostra um aviso e mantém a tela.
 */
export function SnapshotBoundary({ children }: { children: (snapshot: Snapshot) => ReactNode }) {
  const { snapshot, loading, erro, recarregar } = useSnapshot();

  if (!snapshot) {
    if (loading) return <SkeletonCards />;
    return (
      <EmptyState
        icon="cloud-offline-outline"
        title="Não foi possível carregar"
        description="Verifique sua conexão e tente de novo. Seus relatos continuam salvos no celular."
        actionLabel="Tentar de novo"
        onAction={recarregar}
      />
    );
  }

  return (
    <>
      {erro && (
        <View style={styles.stack}>
          <Notice tone="warning" title="Dados desatualizados" urgent>
            Não foi possível atualizar agora. Mostrando as últimas informações.
          </Notice>
          <Button label="Tentar de novo" variant="secondary" onPress={recarregar} icon="refresh" />
        </View>
      )}
      {children(snapshot)}
    </>
  );
}

const styles = StyleSheet.create({ stack: { gap: spacing.md } });
