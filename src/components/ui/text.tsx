import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { colors, typography, type TypographyVariant } from '@/constants/theme';

type Color = 'default' | 'muted' | 'subtle' | 'primary' | 'inverse' | 'inverseMuted' | 'danger';

const colorMap: Record<Color, string> = {
  default: colors.text,
  muted: colors.textMuted,
  subtle: colors.textSubtle,
  primary: colors.primary,
  inverse: colors.textInverse,
  inverseMuted: colors.textInverseMuted,
  danger: colors.danger,
};

interface Props extends RNTextProps {
  variant?: TypographyVariant;
  color?: Color;
  /** Marca o texto como título de seção para leitores de tela. */
  header?: boolean;
}

export function Text({ variant = 'body', color = 'default', header, style, ...rest }: Props) {
  return (
    <RNText
      accessibilityRole={header ? 'header' : undefined}
      style={[typography[variant], { color: colorMap[color] }, style]}
      {...rest}
    />
  );
}
