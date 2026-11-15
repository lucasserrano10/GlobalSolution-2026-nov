import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { SnapshotBoundary } from '@/components/snapshot-boundary';
import { Badge, Button, Card, EmptyState, Icon, Notice, ProgressBar, Screen, SectionHeader, Text } from '@/components/ui';
import { colors, riscoStyle, spacing } from '@/constants/theme';
import { useSnapshot } from '@/state/snapshot-context';

export default function RuaDetalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { favoritas, alternarFavorita } = useSnapshot();
  const router = useRouter();

  return (
    <Screen narrow>
      <SnapshotBoundary>
        {(s) => {
          const rua = s.ruas.find((r) => r.id === id);
          if (!rua) {
            return (
              <EmptyState
                icon="help-circle-outline"
                title="Rua não encontrada"
                description="Ela pode ter saído da lista nesta simulação."
                actionLabel="Voltar ao início"
                onAction={() => router.navigate('/')}
              />
            );
          }
          const quadra = s.quadras.find((q) => q.id === rua.quadraId);
          const r = riscoStyle[rua.risco];
          const favorita = favoritas.includes(rua.id);

          return (
            <>
              <Card>
                <Text variant="display" header>
                  {rua.nome}
                </Text>
                <Badge label={r.label} icon={r.icon} colorsOverride={r} />
                <Text color="muted" style={styles.orientacao}>
                  {r.orientacao}
                </Text>
              </Card>

              <View style={styles.row}>
                <Card style={styles.half} accessible accessibilityLabel={`Água na rua: ${rua.laminaCm > 0 ? `${rua.laminaCm} centímetros` : 'nenhuma'}`}>
                  <Icon name="water" size={22} color={colors.primary} />
                  <Text variant="stat">{rua.laminaCm > 0 ? `${rua.laminaCm} cm` : '0 cm'}</Text>
                  <Text variant="caption" color="muted">
                    Água na rua
                  </Text>
                </Card>
                <Card style={styles.half} accessible accessibilityLabel={`${rua.bocasObstruidas} de ${rua.bocasTotal} bocas de lobo obstruídas`}>
                  <Icon name="grid-outline" size={22} color={r.accent} />
                  <Text variant="stat">
                    {rua.bocasObstruidas}/{rua.bocasTotal}
                  </Text>
                  <Text variant="caption" color="muted">
                    Bocas obstruídas
                  </Text>
                </Card>
              </View>

              <Card>
                <ProgressBar value={rua.bocasObstruidas} max={rua.bocasTotal} color={r.accent} label="Bocas de lobo obstruídas" />
              </Card>

              {quadra && (
                <View style={styles.group}>
                  <SectionHeader title="Quadra que protege esta rua" />
                  <Card>
                    <Text variant="bodyStrong">{quadra.nome}</Text>
                    <Text variant="caption" color="muted">
                      {quadra.acessoTravado ? 'Acesso travado' : 'Liberada para uso'} · ocupação {quadra.ocupacaoPct}%
                    </Text>
                    <ProgressBar value={quadra.ocupacaoPct} max={100} label="Ocupação da quadra" />
                  </Card>
                </View>
              )}

              {rua.risco === 'critico' && (
                <Notice tone="danger" title="Atenção" urgent>
                  Não atravesse ruas alagadas nem entre nas quadras durante a chuva.
                </Notice>
              )}

              <View style={styles.actions}>
                <Button
                  label="Reportar problema nesta rua"
                  icon="add-circle-outline"
                  onPress={() => router.navigate({ pathname: '/reportar', params: { ruaId: rua.id } })}
                />
                <Button
                  label={favorita ? 'Remover das minhas ruas' : 'Salvar nas minhas ruas'}
                  icon={favorita ? 'star' : 'star-outline'}
                  variant="secondary"
                  onPress={() => alternarFavorita(rua.id)}
                />
              </View>
            </>
          );
        }}
      </SnapshotBoundary>
    </Screen>
  );
}

const styles = StyleSheet.create({
  orientacao: { marginTop: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1, gap: 2 },
  group: { gap: spacing.md },
  actions: { gap: spacing.sm },
});
