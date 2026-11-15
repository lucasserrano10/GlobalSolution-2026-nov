import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { spacing } from '@/constants/theme';

interface Props {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.box}>
      <Text variant="heading" header>
        {title}
      </Text>
      {subtitle && (
        <Text variant="caption" color="muted">
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({ box: { gap: 2, marginTop: spacing.sm } });
