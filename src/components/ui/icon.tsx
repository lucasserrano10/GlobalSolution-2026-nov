import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Ionicons>['name'];

interface IconProps {
  name: IconName;
  size?: number;
  color: string;
}

/** Único ponto de uso de ícones (Ionicons, traço consistente). Decorativo para leitores de tela. */
export function Icon({ name, size = 20, color }: IconProps) {
  return <Ionicons name={name} size={size} color={color} accessible={false} importantForAccessibility="no" />;
}
