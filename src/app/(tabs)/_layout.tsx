import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { colors } from '@/constants/colors';
import { useAuthStore } from '@/features/auth/auth-store';

const icons = {
  index: ['home-outline', 'home'],
  spaces: ['business-outline', 'business'],
  reservations: ['calendar-outline', 'calendar'],
  profile: ['person-outline', 'person'],
} as const;

export default function TabsLayout() {
  const session = useAuthStore((state) => state.session);
  if (!session) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginTop: 3 },
        tabBarStyle: {
          height: 76,
          paddingTop: 9,
          paddingBottom: 10,
          borderTopColor: colors.border,
          backgroundColor: '#FFFFFF',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const routeIcons = icons[route.name as keyof typeof icons] ?? icons.index;
          return <Ionicons name={routeIcons[focused ? 1 : 0]} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="spaces" options={{ title: 'Espacios' }} />
      <Tabs.Screen name="reservations" options={{ title: 'Reservas' }} />
      <Tabs.Screen name="profile" options={{ title: 'Mi perfil' }} />
    </Tabs>
  );
}
