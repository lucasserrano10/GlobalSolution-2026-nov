import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RelatoCard } from '@/components/relato-card';
import { EmptyState, Grid, Notice, Screen, Skeleton, Card, useFeedback } from '@/components/ui';
import { spacing } from '@/constants/theme';
import type { Relato } from '@/data/types';
import { useRelatos } from '@/hooks/use-relatos';

export default function MeusRelatos() {
  const { relatos, erro, carregar, reenviar, excluir } = useRelatos();
  const { toast, confirm } = useFeedback();
  const router = useRouter();
  const [reenviandoId, setReenviandoId] = useState<number | null>(null);

  async function onReenviar(r: Relato) {
    setReenviandoId(r.id);
    const ok = await reenviar(r);
    setReenviandoId(null);
    toast(
      ok
        ? { tone: 'success', title: 'Relato enviado' }
        : { tone: 'danger', title: 'Sem conexão', message: 'Não foi possível enviar agora. Tente mais tarde.' },
    );
  }

  async function onExcluir(r: Relato) {
    const ok = await confirm({
      title: 'Excluir relato?',
      message: 'Ele será apagado só deste celular. Essa ação não pode ser desfeita.',
      confirmLabel: 'Excluir',
      destructive: true,
    });
    if (!ok) return;
    try {
      await excluir(r);
      toast({ tone: 'success', title: 'Relato excluído' });
    } catch {
      toast({ tone: 'danger', title: 'Não foi possível excluir', message: 'Tente novamente.' });
    }
  }

  return (
    <Screen onRefresh={carregar}>
      {relatos === null && (
        <View style={styles.stack} accessible accessibilityLabel="Carregando seus relatos" accessibilityLiveRegion="polite">
          {[0, 1].map((i) => (
            <Card key={i}>
              <Skeleton width="60%" height={20} />
              <Skeleton height={14} />
              <Skeleton width="35%" height={26} />
            </Card>
          ))}
        </View>
      )}

      {erro && (
        <Notice tone="danger" title="Erro ao ler os relatos" urgent>
          Não foi possível acessar os dados salvos no celular. Puxe a tela para tentar de novo.
        </Notice>
      )}

      {relatos?.length === 0 && !erro && (
        <EmptyState
          icon="document-text-outline"
          title="Nenhum relato ainda"
          description="Viu uma boca de lobo entupida ou uma rua alagada? Avise em poucos toques."
          actionLabel="Reportar um problema"
          onAction={() => router.navigate('/reportar')}
        />
      )}

      {!!relatos?.length && (
        <Grid maxColumns={2}>
          {relatos.map((r) => (
            <RelatoCard key={r.id} relato={r} reenviando={reenviandoId === r.id} onReenviar={() => onReenviar(r)} onExcluir={() => onExcluir(r)} />
          ))}
        </Grid>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({ stack: { gap: spacing.md } });
