import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { colors, radius, spacing } from '@/constants/theme';

interface Props {
  icon: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Estado vazio (ou de erro bloqueante) com ação clara. */
export function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
  return (
    <View style={styles.box}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={32} color={colors.primary} />
      </View>
      <Text variant="heading" style={styles.center} header>
        {title}
      </Text>
      <Text variant="caption" color="muted" style={styles.center}>
        {description}
      </Text>
      {actionLabel && onAction && (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} fullWidth={false} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  center: { textAlign: 'center' },
  action: { marginTop: spacing.md },
});
