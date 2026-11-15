import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { colors, radius } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface Props {
  value: number;
  max: number;
  color?: string;
  label: string;
  height?: number;
}

/** Barra de progresso acessível (valor anunciado) com preenchimento animado. */
export function ProgressBar({ value, max, color = colors.primary, label, height = 10 }: Props) {
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const [anim] = useState(() => new Animated.Value(0));
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      anim.setValue(pct);
      return;
    }
    Animated.timing(anim, { toValue: pct, duration: 450, useNativeDriver: false }).start();
  }, [pct, reduced, anim]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View
      style={[styles.track, { height }]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max, now: value }}>
      <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: colors.surfaceMuted, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
});
