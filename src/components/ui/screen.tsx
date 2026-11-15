import { RefreshControl, ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

interface Props extends Omit<ScrollViewProps, 'refreshControl'> {
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Conteúdo mais estreito (formulários). */
  narrow?: boolean;
}

/** Container de tela: rolagem, safe area, largura máxima centralizada e pull-to-refresh opcional. */
export function Screen({ children, onRefresh, refreshing = false, narrow, contentContainerStyle, ...rest }: Props) {
  const insets = useSafeAreaInsets();
  const { gutter } = useLayout();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: gutter, paddingTop: gutter, paddingBottom: insets.bottom + gutter * 2 },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} /> : undefined}
      {...rest}>
      <View style={[styles.inner, { maxWidth: narrow ? layout.narrowWidth : layout.maxWidth, gap: gutter }]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { alignItems: 'center' },
  inner: { width: '100%' },
});
