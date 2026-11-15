import { Platform, type TextStyle, type ViewStyle } from 'react-native';

import type { Risco } from '@/data/types';

/** Design tokens do Quadra Viva. Todas as cores de texto têm contraste AA sobre o fundo em que são usadas. */
export const colors = {
  bg: '#F4F6F9',
  surface: '#FFFFFF',
  surfaceMuted: '#EAEFF4',
  border: '#E1E7EE',
  borderStrong: '#C5CFDA',

  text: '#0D1B2A',
  textMuted: '#506070',
  textSubtle: '#627282',
  textInverse: '#FFFFFF',
  textInverseMuted: '#B7C6D6',

  primary: '#0A6EBD',
  primaryPressed: '#085A9C',
  primaryDark: '#064E8A',
  primarySoft: '#E4F0FA',

  ink: '#0D2538',
  overlay: 'rgba(13, 37, 56, 0.55)',

  success: '#0F5A2A',
  warning: '#7A4B00',
  danger: '#B3261E',
  dangerPressed: '#8F1E18',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 } as const;

export const layout = {
  tablet: 640,
  desktop: 1024,
  maxWidth: 1080,
  narrowWidth: 640,
  /** Área de toque mínima (dp). */
  touch: 48,
} as const;

export const typography = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.4 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.2 },
  heading: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  captionStrong: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  overline: { fontSize: 13, lineHeight: 16, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  stat: { fontSize: 26, lineHeight: 30, fontWeight: '700', letterSpacing: -0.3 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

const iosShadow: ViewStyle = {
  shadowColor: '#0D2538',
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
};

export const shadow = {
  card: Platform.select<ViewStyle>({ android: { elevation: 1 }, default: iosShadow }) ?? iosShadow,
  raised: Platform.select<ViewStyle>({ android: { elevation: 4 }, default: { ...iosShadow, shadowOpacity: 0.14 } }) ?? iosShadow,
};

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export const toneStyle: Record<Tone, { bg: string; fg: string; border: string }> = {
  neutral: { bg: colors.surfaceMuted, fg: colors.textMuted, border: colors.border },
  info: { bg: colors.primarySoft, fg: colors.primaryDark, border: '#BBD7EE' },
  success: { bg: '#E1F4E8', fg: colors.success, border: '#B5DEC1' },
  warning: { bg: '#FFF2D6', fg: colors.warning, border: '#F2D590' },
  danger: { bg: '#FCE4E1', fg: '#8C1A13', border: '#F2B8B2' },
};

/** O risco nunca depende só da cor: sempre há ícone + texto. `accent` é usado só em elementos decorativos (barras). */
export const riscoStyle: Record<
  Risco,
  {
    label: string;
    bg: string;
    fg: string;
    accent: string;
    tone: Tone;
    icon: 'checkmark-circle' | 'alert-circle' | 'warning' | 'flash';
    orientacao: string;
  }
> = {
  baixo: {
    label: 'Risco baixo',
    bg: '#E1F4E8',
    fg: '#0F5A2A',
    accent: '#2E9E5B',
    tone: 'success',
    icon: 'checkmark-circle',
    orientacao: 'Nenhuma ação necessária agora. Continue acompanhando o app.',
  },
  atencao: {
    label: 'Atenção',
    bg: '#FFF2D6',
    fg: '#7A4B00',
    accent: '#E0A100',
    tone: 'warning',
    icon: 'alert-circle',
    orientacao: 'Fique atento ao tempo e evite descartar lixo na rua ou perto das bocas de lobo.',
  },
  alto: {
    label: 'Risco alto',
    bg: '#FFE3CC',
    fg: '#8A3A00',
    accent: '#E8590C',
    tone: 'warning',
    icon: 'warning',
    orientacao: 'Se possível, leve veículos e objetos para um local alto e evite ficar nesta rua.',
  },
  critico: {
    label: 'Risco crítico',
    bg: '#FCE4E1',
    fg: '#8C1A13',
    accent: '#D92D20',
    tone: 'danger',
    icon: 'flash',
    orientacao: 'Evite sair. Não atravesse ruas alagadas nem entre nas quadras. Siga as orientações da Defesa Civil.',
  },
};
