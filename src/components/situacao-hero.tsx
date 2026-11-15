import { StyleSheet, View } from 'react-native';

import { Badge, Icon, Text } from '@/components/ui';
import { colors, radius, riscoStyle, spacing } from '@/constants/theme';
import type { Risco, Snapshot } from '@/data/types';
import { formatHora } from '@/utils/format';

interface Props {
  snapshot: Snapshot;
  piorRisco: Risco;
}

/** Cartão principal: fase atual do evento de chuva, maior risco do bairro e horário da atualização. */
export function SituacaoHero({ snapshot, piorRisco }: Props) {
  const r = riscoStyle[piorRisco];
  return (
    <View
      style={styles.hero}
      accessible
      accessibilityLabel={`Situação agora: ${snapshot.fase.titulo}. ${snapshot.fase.descricao}. Maior risco no bairro: ${r.label}.`}>
      <View style={styles.top}>
        <Text variant="overline" color="inverseMuted">
          Situação agora
        </Text>
        <View style={styles.updated}>
          <Icon name="time-outline" size={14} color={colors.textInverseMuted} />
          <Text variant="caption" color="inverseMuted">
            {formatHora(snapshot.atualizadoEm)}
          </Text>
        </View>
      </View>
      <Text variant="display" color="inverse" header>
        {snapshot.fase.titulo}
      </Text>
      <Text color="inverseMuted">{snapshot.fase.descricao}</Text>
      <View style={styles.badgeRow}>
        <Text variant="caption" color="inverseMuted">
          Maior risco no bairro
        </Text>
        <Badge label={r.label} icon={r.icon} colorsOverride={r} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.ink, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  updated: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  badgeRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
});
