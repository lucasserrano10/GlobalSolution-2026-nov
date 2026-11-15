import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FeedbackProvider } from '@/components/ui';
import { colors } from '@/constants/theme';
import { SnapshotProvider } from '@/state/snapshot-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FeedbackProvider>
        <SnapshotProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.surface },
              headerShadowVisible: false,
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: '700' },
              contentStyle: { backgroundColor: colors.bg },
            }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="rua/[id]" options={{ title: 'Detalhes da rua', headerBackTitle: 'Voltar' }} />
          </Stack>
        </SnapshotProvider>
      </FeedbackProvider>
    </SafeAreaProvider>
  );
}
