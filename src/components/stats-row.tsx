import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';

interface StatProps {
  value: string;
  label: string;
}

function Stat({ value, label }: StatProps) {
  return (
    <Card style={styles.tile} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text variant="stat">{value}</Text>
      <Text variant="caption" color="muted">
        {label}
      </Text>
    </Card>
  );
}

/** Linha de indicadores resumidos do bairro. */
export function StatsRow({ items }: { items: StatProps[] }) {
  return (
    <View style={styles.row}>
      {items.map((s) => (
        <Stat key={s.label} {...s} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  tile: { flex: 1, padding: spacing.md, gap: 2 },
});
