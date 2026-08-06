import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useAuthStore } from '@/features/auth/auth-store';
import { queryClient } from '@/core/query-client';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const hydrated = useAuthStore((state) => state.hydrated);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (hydrated) void SplashScreen.hideAsync();
  }, [hydrated]);

  if (!hydrated) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    </QueryClientProvider>
  );
}
