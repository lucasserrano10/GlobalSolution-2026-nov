import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { colors, layout, radius, spacing } from '@/constants/theme';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
  /** `chip` é compacto e inline; `row` ocupa a linha toda (formulários). */
  variant?: 'chip' | 'row';
  accessibilityLabel?: string;
}

/** Opção selecionável (radio). Seleção indicada por cor, borda e ícone de check, nunca só por cor. */
export function Choice({ label, selected, onPress, icon, variant = 'row', accessibilityLabel }: Props) {
  const fg = selected ? colors.primaryDark : colors.text;
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      scaleTo={0.97}
      style={[
        styles.base,
        variant === 'chip' ? styles.chip : styles.row,
        selected ? styles.on : styles.off,
      ]}>
      <View style={styles.content}>
        {icon && <Icon name={icon} size={20} color={selected ? colors.primary : colors.textMuted} />}
        <Text variant={selected ? 'bodyStrong' : 'body'} style={[{ color: fg }, variant === 'row' && styles.flex]}>
          {label}
        </Text>
        {selected && variant === 'row' && <Icon name="checkmark-circle" size={22} color={colors.primary} />}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: layout.touch, justifyContent: 'center', borderWidth: 1.5 },
  chip: { borderRadius: radius.pill, paddingHorizontal: spacing.lg, alignSelf: 'flex-start' },
  row: { borderRadius: radius.md, paddingHorizontal: spacing.lg, alignSelf: 'stretch' },
  on: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  off: { backgroundColor: colors.surface, borderColor: colors.border },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
});
