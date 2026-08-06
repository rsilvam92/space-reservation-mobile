import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/components/brand';
import { ErrorMessage } from '@/components/error-message';
import { EmptyState, ErrorState, LoadingState, Page, RefreshButton } from '@/components/page';
import { ReservationCard } from '@/components/reservation-card';
import { colors } from '@/constants/colors';
import { apiMessage } from '@/core/api';
import { queryKeys } from '@/core/query-keys';
import { getReservations } from '@/features/resident/resident-api';
import { useResidentContext } from '@/features/resident/resident-hooks';

export default function HomeScreen() {
  const context = useResidentContext();
  const reservations = useQuery({
    queryKey: queryKeys.reservations(context.session?.id),
    queryFn: () => getReservations(context.session!.id),
    enabled: Boolean(context.session),
  });
  const refresh = () =>
    void Promise.all([
      context.profileQuery.refetch(),
      context.apartmentsQuery.refetch(),
      context.spacesQuery.refetch(),
      reservations.refetch(),
    ]);
  const activeReservations = (reservations.data ?? []).filter((item) =>
    ['PENDING', 'CONFIRMED'].includes(item.estado),
  );
  const next = [...activeReservations].sort((a, b) =>
    `${a.fecha}${a.horaInicio}`.localeCompare(`${b.fecha}${b.horaInicio}`),
  )[0];

  if (context.profileQuery.isLoading)
    return (
      <Page title="Inicio">
        <LoadingState label="Preparando tu comunidad..." />
      </Page>
    );
  if (context.profileQuery.error) {
    return (
      <Page title="Inicio">
        <ErrorState
          description={apiMessage(context.profileQuery.error)}
          onRetry={() => void context.profileQuery.refetch()}
        />
      </Page>
    );
  }

  const firstName =
    context.profileQuery.data?.nombre ??
    context.session?.nombreCompleto?.split(' ')[0] ??
    'Residente';
  const condominiumName = context.profileQuery.data?.condominio ?? context.condominium?.nombre;
  const apartmentName =
    context.profileQuery.data?.apartamento ??
    (context.apartment ? `${context.apartment.sector} · ${context.apartment.numero}` : undefined);
  return (
    <Page
      title={`Hola, ${firstName}`}
      subtitle="Todo lo que necesitas de tu comunidad."
      right={<RefreshButton onPress={refresh} loading={context.profileQuery.isFetching} />}
    >
      <LinearGradient colors={['#142B63', '#3558E8']} style={styles.communityCard}>
        <View style={styles.brandRow}>
          <Brand light />
          <View style={styles.activeDot} />
        </View>
        <View style={styles.communityInfo}>
          <Text style={styles.communityLabel}>TU CONDOMINIO</Text>
          <Text style={styles.communityName}>{condominiumName ?? 'Condominio por confirmar'}</Text>
          <Text style={styles.apartment}>{apartmentName ?? 'Apartamento por confirmar'}</Text>
        </View>
      </LinearGradient>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <View style={[styles.statIcon, { backgroundColor: colors.blueSoft }]}>
            <Ionicons name="business" size={20} color={colors.blue} />
          </View>
          <Text style={styles.statValue}>{context.spaces.length}</Text>
          <Text style={styles.statLabel}>Espacios</Text>
        </View>
        <View style={styles.stat}>
          <View style={[styles.statIcon, { backgroundColor: colors.successSoft }]}>
            <Ionicons name="calendar" size={20} color={colors.success} />
          </View>
          <Text style={styles.statValue}>{activeReservations.length}</Text>
          <Text style={styles.statLabel}>Activas</Text>
        </View>
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={() => router.push('/reserve')}>
          <View style={styles.actionIcon}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Nueva reserva</Text>
            <Text style={styles.actionSubtitle}>Elige espacio y horario</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Pressable>
        <Pressable style={styles.action} onPress={() => router.push('/(tabs)/spaces')}>
          <View style={[styles.actionIcon, { backgroundColor: colors.indigo }]}>
            <Ionicons name="search" size={21} color="#FFFFFF" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Explorar espacios</Text>
            <Text style={styles.actionSubtitle}>Consulta reglas y disponibilidad</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Pressable>
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Próxima reserva</Text>
        <Pressable onPress={() => router.push('/(tabs)/reservations')}>
          <Text style={styles.seeAll}>Ver todas</Text>
        </Pressable>
      </View>
      <ErrorMessage message={reservations.error ? apiMessage(reservations.error) : undefined} />
      {next ? (
        <ReservationCard reservation={next} />
      ) : (
        <EmptyState
          icon="calendar-outline"
          title="Sin reservas próximas"
          description="Cuando hagas una reserva aparecerá aquí."
        />
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  communityCard: {
    borderRadius: 26,
    padding: 20,
    minHeight: 205,
    justifyContent: 'space-between',
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 7,
  },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#69E0B8',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  communityInfo: { gap: 3 },
  communityLabel: { color: '#BFCBFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  communityName: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  apartment: { color: '#DDE5FF', fontSize: 14 },
  stats: { flexDirection: 'row', gap: 12 },
  stat: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 21,
    padding: 16,
    gap: 4,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: { color: colors.text, fontSize: 24, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 12 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  seeAll: { color: colors.blue, fontSize: 13, fontWeight: '800' },
  actions: { gap: 10 },
  action: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 19,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { flex: 1, gap: 2 },
  actionTitle: { color: colors.text, fontSize: 14, fontWeight: '800' },
  actionSubtitle: { color: colors.muted, fontSize: 12 },
});
