import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { colors, layout, radius, spacing } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  /** Ocupa a largura toda do container (padrão em formulários). */
  fullWidth?: boolean;
  hint?: string;
}

const palette: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.primary, fg: colors.textInverse, border: colors.primary },
  secondary: { bg: colors.surface, fg: colors.primary, border: colors.borderStrong },
  ghost: { bg: 'transparent', fg: colors.primary, border: 'transparent' },
  danger: { bg: colors.danger, fg: colors.textInverse, border: colors.danger },
};

export function Button({ label, onPress, variant = 'primary', icon, disabled, loading, fullWidth = true, hint }: Props) {
  const p = palette[variant];
  const inativo = disabled || loading;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled: !!inativo, busy: !!loading }}
      disabled={inativo}
      onPress={onPress}
      style={[
        styles.base,
        { backgroundColor: p.bg, borderColor: p.border, opacity: inativo ? 0.5 : 1 },
        fullWidth ? styles.full : styles.auto,
      ]}>
      <View style={styles.row}>
        {loading ? <ActivityIndicator color={p.fg} /> : icon ? <Icon name={icon} size={20} color={p.fg} /> : null}
        <Text variant="bodyStrong" style={{ color: p.fg }}>
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.touch,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  full: { alignSelf: 'stretch' },
  auto: { alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
});
