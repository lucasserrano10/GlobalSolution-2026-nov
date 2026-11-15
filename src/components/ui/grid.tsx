import { Children, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useLayout } from '@/hooks/use-layout';

interface Props {
  children: ReactNode;
  /** Máximo de colunas (limitado pelo tamanho da tela). */
  maxColumns?: number;
}

/** Grade responsiva: 1 coluna no celular, 2 no tablet, 3 em telas largas. */
export function Grid({ children, maxColumns = 3 }: Props) {
  const { columns, gutter } = useLayout();
  const cols = Math.min(columns, maxColumns);
  const items = Children.toArray(children);
  const basis = `${100 / cols}%` as const;

  return (
    <View style={[styles.grid, { marginHorizontal: -gutter / 2, marginBottom: -gutter }]}>
      {items.map((child, i) => (
        <View key={i} style={{ width: basis, padding: gutter / 2, paddingTop: 0, paddingBottom: gutter }}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap' } });
