import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { radius, spacing, toneStyle, type Tone } from '@/constants/theme';

interface Props {
  label: string;
  tone?: Tone;
  icon?: IconName;
  /** Cores personalizadas (ex.: níveis de risco). */
  colorsOverride?: { bg: string; fg: string };
}

export function Badge({ label, tone = 'neutral', icon, colorsOverride }: Props) {
  const t = colorsOverride ?? toneStyle[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]} accessible accessibilityLabel={label}>
      {icon && <Icon name={icon} size={16} color={t.fg} />}
      <Text variant="captionStrong" style={{ color: t.fg }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
});
