import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState, ErrorState, LoadingState, Page, RefreshButton } from '@/components/page';
import { ReservationCard } from '@/components/reservation-card';
import { colors } from '@/constants/colors';
import { apiMessage } from '@/core/api';
import { queryKeys } from '@/core/query-keys';
import { useAuthStore } from '@/features/auth/auth-store';
import { cancelReservation, getReservations } from '@/features/resident/resident-api';

export default function ReservationsScreen() {
  const session = useAuthStore((state) => state.session);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.reservations(session?.id),
    queryFn: () => getReservations(session!.id),
    enabled: Boolean(session),
  });
  const cancelMutation = useMutation({
    mutationFn: cancelReservation,
    onSuccess: () =>
      void queryClient.invalidateQueries({
        queryKey: queryKeys.reservations(session?.id),
      }),
    onError: (error) => Alert.alert('No se pudo cancelar', apiMessage(error)),
  });
  const askCancel = (id: number) =>
    Alert.alert('Cancelar reserva', '¿Confirmas que deseas cancelar esta reserva?', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', style: 'destructive', onPress: () => cancelMutation.mutate(id) },
    ]);
  const data = [...(query.data ?? [])].sort((a, b) =>
    `${b.fecha}${b.horaInicio}`.localeCompare(`${a.fecha}${a.horaInicio}`),
  );

  return (
    <Page
      title="Mis reservas"
      subtitle="Consulta y administra tus solicitudes."
      right={<RefreshButton onPress={() => void query.refetch()} loading={query.isFetching} />}
    >
      <Pressable style={styles.newButton} onPress={() => router.push('/reserve')}>
        <Ionicons name="add" size={22} color="#FFFFFF" />
        <Text style={styles.newButtonText}>Nueva reserva</Text>
      </Pressable>
      {query.isLoading ? (
        <LoadingState label="Consultando tus reservas..." />
      ) : query.error ? (
        <ErrorState description={apiMessage(query.error)} onRetry={() => void query.refetch()} />
      ) : data.length ? (
        <View style={styles.list}>
          {data.map((item) => (
            <ReservationCard key={item.id} reservation={item} onCancel={() => askCancel(item.id)} />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="calendar-outline"
          title="Aún no tienes reservas"
          description="Selecciona un espacio común y crea tu primera reserva."
        />
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  newButton: {
    minHeight: 51,
    borderRadius: 16,
    backgroundColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  newButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  list: { gap: 12 },
});
