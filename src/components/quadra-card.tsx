import { StyleSheet, View } from 'react-native';

import { Badge, Card, Icon, ProgressBar, Text } from '@/components/ui';
import { colors, radius, spacing, type Tone } from '@/constants/theme';
import type { EstadoQuadra, Quadra } from '@/data/types';

const ESTADO: Record<EstadoQuadra, { label: string; tone: Tone }> = {
  uso: { label: 'Liberada para uso', tone: 'success' },
  esvaziando: { label: 'Esvaziando', tone: 'warning' },
  travada: { label: 'Acesso travado', tone: 'warning' },
  retendo: { label: 'Retendo água da chuva', tone: 'info' },
};

export function QuadraCard({ quadra }: { quadra: Quadra }) {
  const estado = ESTADO[quadra.estado];
  const volume = Math.round((quadra.ocupacaoPct / 100) * quadra.capacidadeM3);

  return (
    <Card
      accessible
      accessibilityLabel={`${quadra.nome}. ${quadra.endereco}. ${estado.label}. Ocupação ${quadra.ocupacaoPct} por cento, ${volume} de ${quadra.capacidadeM3} metros cúbicos.`}>
      <View style={styles.head}>
        <View style={styles.iconWrap}>
          <Icon name="basketball" size={22} color={colors.primary} />
        </View>
        <View style={styles.headText}>
          <Text variant="heading">{quadra.nome}</Text>
          <Text variant="caption" color="muted">
            {quadra.endereco}
          </Text>
        </View>
      </View>

      <View style={styles.badges}>
        <Badge label={estado.label} tone={estado.tone} />
        <Badge
          label={quadra.acessoTravado ? 'Acesso travado' : 'Acesso livre'}
          tone="neutral"
          icon={quadra.acessoTravado ? 'lock-closed' : 'lock-open'}
        />
      </View>

      <View style={styles.occupancy}>
        <View style={styles.row}>
          <Text variant="caption" color="muted">
            Ocupação
          </Text>
          <Text variant="captionStrong">
            {volume} de {quadra.capacidadeM3} m³ ({quadra.ocupacaoPct}%)
          </Text>
        </View>
        <ProgressBar value={quadra.ocupacaoPct} max={100} label="Ocupação da quadra" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: { flex: 1 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  occupancy: { gap: spacing.xs + 2, marginTop: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.xs },
});
