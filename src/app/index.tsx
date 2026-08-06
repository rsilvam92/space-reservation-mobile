import { Redirect } from 'expo-router';

import { useAuthStore } from '@/features/auth/auth-store';

export default function IndexScreen() {
  const session = useAuthStore((state) => state.session);
  return <Redirect href={session ? '/(tabs)' : '/login'} />;
}
