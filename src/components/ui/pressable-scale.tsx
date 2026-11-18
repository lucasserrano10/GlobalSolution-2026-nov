import { useState, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface Props extends Omit<PressableProps, 'style' | 'children'> {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  /** Escala ao pressionar (microinteração). */
  scaleTo?: number;
}

/** Propriedades de posicionamento que precisam ficar no Pressable (o pai), não na View animada. */
function splitLayout(style: StyleProp<ViewStyle>) {
  const { flex, flexGrow, flexShrink, flexBasis, alignSelf, width, minWidth, maxWidth, margin, marginHorizontal, marginVertical, marginTop, marginBottom, marginLeft, marginRight, ...inner } =
    StyleSheet.flatten(style) ?? {};
  const outer: ViewStyle = { flex, flexGrow, flexShrink, flexBasis, alignSelf, width, minWidth, maxWidth, margin, marginHorizontal, marginVertical, marginTop, marginBottom, marginLeft, marginRight };
  (Object.keys(outer) as (keyof ViewStyle)[]).forEach((k) => outer[k] === undefined && delete outer[k]);
  return { outer, inner };
}

/** Pressable com feedback sutil de escala, desativado se o usuário pediu menos movimento. */
export function PressableScale({ style, children, scaleTo = 0.98, onPressIn, onPressOut, ...rest }: Props) {
  const [scale] = useState(() => new Animated.Value(1));
  const reduced = useReducedMotion();
  const { outer, inner } = splitLayout(style);

  const animate = (to: number) => {
    if (reduced) return;
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  };

  return (
    <Pressable
      style={outer}
      onPressIn={(e) => {
        animate(scaleTo);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        animate(1);
        onPressOut?.(e);
      }}
      {...rest}>
      <Animated.View style={[{ transform: [{ scale }] }, inner, outer.flex !== undefined && styles.fill]}>{children}</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
