import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusPill } from '@/components/status-pill';
import { colors } from '@/constants/colors';
import { formatReservationDate, reservationDuration } from '@/features/resident/reservation-utils';
import type { Reservation } from '@/types/api';

export function ReservationCard({
  reservation,
  onCancel,
}: {
  reservation: Reservation;
  onCancel?: () => void;
}) {
  const cancellable = ['PENDING', 'CONFIRMED'].includes(reservation.estado);
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Ionicons name="calendar" size={21} color={colors.blue} />
      </View>
      <View style={styles.body}>
        <View style={styles.top}>
          <Text style={styles.name}>{reservation.space?.nombre ?? 'Espacio reservado'}</Text>
          <StatusPill status={reservation.estado} />
        </View>
        <Text style={styles.detail}>
          {formatReservationDate(reservation.fecha)} · {reservation.horaInicio.slice(0, 5)}–
          {reservation.horaFin.slice(0, 5)} (
          {reservationDuration(reservation.horaInicio, reservation.horaFin)})
        </Text>
        {onCancel && cancellable ? (
          <Pressable onPress={onCancel} hitSlop={8}>
            <Text style={styles.cancel}>Cancelar reserva</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 13,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 7 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  name: { color: colors.text, fontSize: 15, fontWeight: '800', flex: 1 },
  detail: { color: colors.muted, fontSize: 13 },
  cancel: { color: colors.danger, fontSize: 12, fontWeight: '800', marginTop: 2 },
});
