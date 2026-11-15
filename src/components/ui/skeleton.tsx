import { useEffect, useState } from 'react';
import { Animated, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface Props {
  width?: DimensionValue;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/** Placeholder pulsante para estados de carregamento. Oculto para leitores de tela. */
export function Skeleton({ width = '100%', height = 16, style }: Props) {
  const [opacity] = useState(() => new Animated.Value(1));
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.45, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, reduced]);

  return (
    <Animated.View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={[{ width, height, borderRadius: radius.sm, backgroundColor: colors.surfaceMuted, opacity }, style]}
    />
  );
}
