import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { Icon, type IconName } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';

const tab = (title: string, icon: IconName, iconOff: IconName) => ({
  title,
  tabBarAccessibilityLabel: title,
  tabBarIcon: ({ color, focused }: { color: ColorValue; size: number; focused: boolean }) => (
    <Icon name={focused ? icon : iconOff} size={24} color={color as string} />
  ),
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        sceneStyle: { backgroundColor: colors.bg },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          minHeight: 62,
          paddingTop: spacing.xs,
        },
      }}>
      <Tabs.Screen name="index" options={{ ...tab('Início', 'water', 'water-outline'), title: 'Início', headerTitle: 'Quadra Viva' }} />
      <Tabs.Screen name="quadras" options={tab('Quadras', 'basketball', 'basketball-outline')} />
      <Tabs.Screen name="reportar" options={{ ...tab('Reportar', 'add-circle', 'add-circle-outline'), headerTitle: 'Reportar problema' }} />
      <Tabs.Screen name="relatos" options={tab('Meus relatos', 'list', 'list-outline')} />
    </Tabs>
  );
}
