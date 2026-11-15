import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { radius, spacing, toneStyle, type Tone } from '@/constants/theme';

interface Props {
  tone?: Tone;
  icon?: IconName;
  title?: string;
  children: string;
  /** Anuncia imediatamente para leitores de tela (use em erros/avisos urgentes). */
  urgent?: boolean;
}

const defaultIcon: Record<Tone, IconName> = {
  neutral: 'information-circle',
  info: 'information-circle',
  success: 'checkmark-circle',
  warning: 'alert-circle',
  danger: 'warning',
};

/** Mensagem em linha, para informação, aviso ou erro dentro da tela. */
export function Notice({ tone = 'info', icon, title, children, urgent }: Props) {
  const t = toneStyle[tone];
  return (
    <View
      accessible
      accessibilityRole={urgent ? 'alert' : undefined}
      accessibilityLiveRegion={urgent ? 'assertive' : 'polite'}
      style={[styles.box, { backgroundColor: t.bg, borderColor: t.border }]}>
      <Icon name={icon ?? defaultIcon[tone]} size={22} color={t.fg} />
      <View style={styles.text}>
        {title && (
          <Text variant="bodyStrong" style={{ color: t.fg }}>
            {title}
          </Text>
        )}
        <Text variant="caption" style={{ color: t.fg }}>
          {children}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  text: { flex: 1, gap: 2 },
});
