import { useWindowDimensions } from 'react-native';

import { layout, spacing } from '@/constants/theme';

/** Breakpoints: celular (1 coluna), tablet (2) e telas largas (3). */
export function useLayout() {
  const { width } = useWindowDimensions();
  const columns = width >= layout.desktop ? 3 : width >= layout.tablet ? 2 : 1;
  const gutter = width >= layout.tablet ? spacing.xl : spacing.lg;
  return { width, columns, gutter };
}
