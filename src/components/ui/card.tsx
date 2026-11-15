import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, shadow, spacing } from '@/constants/theme';

interface Props extends ViewProps {
  /** Remove o padding interno (para cards com seções próprias). */
  flush?: boolean;
}

export function Card({ style, flush, ...rest }: Props) {
  return <View style={[styles.card, !flush && styles.padded, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.card,
  },
  padded: { padding: spacing.lg, gap: spacing.sm },
});
