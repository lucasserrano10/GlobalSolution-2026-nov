import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge, Card, Icon, PressableScale, ProgressBar, Text } from '@/components/ui';
import { colors, layout, riscoStyle, spacing } from '@/constants/theme';
import type { Rua } from '@/data/types';

interface Props {
  rua: Rua;
  favorita: boolean;
  onToggleFavorita: () => void;
}

export function RuaCard({ rua, favorita, onToggleFavorita }: Props) {
  const router = useRouter();
  const r = riscoStyle[rua.risco];
  const resumo = `${rua.nome}. ${r.label}. ${rua.bocasObstruidas} de ${rua.bocasTotal} bocas de lobo obstruídas.${
    rua.laminaCm > 0 ? ` ${rua.laminaCm} centímetros de água na rua.` : ''
  }`;

  return (
    <Card flush style={styles.card}>
      <View style={[styles.accent, { backgroundColor: r.accent }]} />
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={resumo}
        accessibilityHint="Abre os detalhes da rua"
        onPress={() => router.push({ pathname: '/rua/[id]', params: { id: rua.id } })}
        style={styles.main}>
        <Text variant="heading">{rua.nome}</Text>
        <Badge label={r.label} icon={r.icon} colorsOverride={r} />
        <View style={styles.meta}>
          <View style={styles.metaRow}>
            <Text variant="caption" color="muted">
              Bocas de lobo obstruídas
            </Text>
            <Text variant="captionStrong">
              {rua.bocasObstruidas}/{rua.bocasTotal}
            </Text>
          </View>
          <ProgressBar value={rua.bocasObstruidas} max={rua.bocasTotal} color={r.accent} label="Bocas de lobo obstruídas" height={8} />
          {rua.laminaCm > 0 && (
            <View style={styles.lamina}>
              <Icon name="water" size={16} color={colors.primary} />
              <Text variant="captionStrong">Água na rua: {rua.laminaCm} cm</Text>
            </View>
          )}
        </View>
      </PressableScale>
      <Pressable
        onPress={onToggleFavorita}
        accessibilityRole="button"
        accessibilityLabel={favorita ? `Remover ${rua.nome} das minhas ruas` : `Salvar ${rua.nome} nas minhas ruas`}
        accessibilityState={{ selected: favorita }}
        hitSlop={4}
        style={styles.fav}>
        <Icon name={favorita ? 'star' : 'star-outline'} size={26} color={favorita ? '#B7791F' : colors.textMuted} />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row' },
  accent: { width: 5 },
  main: { flex: 1, padding: spacing.lg, gap: spacing.sm },
  meta: { gap: spacing.xs + 2, marginTop: spacing.xs },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  lamina: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  fav: { width: layout.touch, height: layout.touch, alignItems: 'center', justifyContent: 'center', margin: spacing.xs },
});
