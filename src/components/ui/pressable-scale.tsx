import { useState, type ReactNode } from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface Props extends Omit<PressableProps, 'style' | 'children'> {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  /** Escala ao pressionar (microinteração). */
  scaleTo?: number;
}

/** Pressable com feedback sutil de escala, desativado se o usuário pediu menos movimento. */
export function PressableScale({ style, children, scaleTo = 0.98, onPressIn, onPressOut, ...rest }: Props) {
  const [scale] = useState(() => new Animated.Value(1));
  const reduced = useReducedMotion();

  const animate = (to: number) => {
    if (reduced) return;
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  };

  return (
    <Pressable
      onPressIn={(e) => {
        animate(scaleTo);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        animate(1);
        onPressOut?.(e);
      }}
      {...rest}>
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}
