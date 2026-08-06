import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Controller } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DateTimeField } from '@/components/date-time-field';
import { ErrorMessage } from '@/components/error-message';
import { PrimaryButton } from '@/components/primary-button';
import { SelectField } from '@/components/select-field';
import { colors } from '@/constants/colors';
import { apiMessage } from '@/core/api';
import { nextDaySummary, reservationMinimumDate } from '@/features/resident/reservation-utils';
import { useReservationForm } from '@/features/resident/use-reservation-form';

export default function ReserveScreen() {
  const {
    control,
    formState: { errors },
    context,
    spaceOpen,
    setSpaceOpen,
    reservationDate,
    endTime,
    endsNextDay,
    selectedSpace,
    mutation,
    submit,
  } = useReservationForm(() => {
    Alert.alert('Reserva creada', 'Tu solicitud fue registrada correctamente.', [
      { text: 'Ver mis reservas', onPress: () => router.replace('/(tabs)/reservations') },
    ]);
  });

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topbar}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={colors.navy} />
          </Pressable>
          <View>
            <Text style={styles.topTitle}>Nueva reserva</Text>
            <Text style={styles.topSubtitle}>{context.condominium?.nombre ?? 'Tu comunidad'}</Text>
          </View>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <View style={styles.intro}>
            <View style={styles.introIcon}>
              <Ionicons name="calendar" size={27} color={colors.blue} />
            </View>
            <View style={styles.introText}>
              <Text style={styles.title}>Reserva un espacio</Text>
              <Text style={styles.subtitle}>
                Selecciona la zona común, la fecha y el horario que necesitas.
              </Text>
            </View>
          </View>
          <View style={styles.form}>
            <Controller
              control={control}
              name="spaceId"
              render={({ field }) => (
                <SelectField
                  label="Espacio común"
                  placeholder={
                    context.spacesQuery.isLoading ? 'Cargando espacios...' : 'Selecciona un espacio'
                  }
                  value={field.value}
                  options={context.spaces
                    .filter((item) => item.activo)
                    .map((item) => ({ label: item.nombre, value: String(item.id) }))}
                  open={spaceOpen}
                  onOpen={() => setSpaceOpen(true)}
                  onClose={() => setSpaceOpen(false)}
                  onChange={field.onChange}
                  error={errors.spaceId?.message}
                />
              )}
            />
            {selectedSpace ? (
              <View style={styles.spaceSummary}>
                <Ionicons name="information-circle" size={20} color={colors.blue} />
                <View style={styles.summaryBody}>
                  <Text style={styles.summaryTitle}>
                    {selectedSpace.descripcion || 'Espacio disponible para residentes.'}
                  </Text>
                  <Text style={styles.summaryRule}>
                    {selectedSpace.configuracion?.maxHorasReserva
                      ? `Máximo ${selectedSpace.configuracion.maxHorasReserva} horas por reserva.`
                      : 'Sujeto a las reglas definidas por la administración.'}
                  </Text>
                </View>
              </View>
            ) : null}
            <Controller
              control={control}
              name="fecha"
              render={({ field }) => (
                <DateTimeField
                  label="Fecha"
                  mode="date"
                  value={field.value}
                  onChange={field.onChange}
                  minimumDate={reservationMinimumDate()}
                  error={errors.fecha?.message}
                />
              )}
            />
            <View style={styles.row}>
              <View style={styles.half}>
                <Controller
                  control={control}
                  name="horaInicio"
                  render={({ field }) => (
                    <DateTimeField
                      label="Hora inicial"
                      mode="time"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.horaInicio?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.half}>
                <Controller
                  control={control}
                  name="horaFin"
                  render={({ field }) => (
                    <DateTimeField
                      label="Hora final"
                      mode="time"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.horaFin?.message}
                    />
                  )}
                />
              </View>
            </View>
            {endsNextDay ? (
              <View style={styles.nextDayNotice}>
                <Ionicons name="moon-outline" size={18} color={colors.blue} />
                <Text style={styles.nextDayText}>{nextDaySummary(reservationDate, endTime)}</Text>
              </View>
            ) : null}
            <ErrorMessage message={mutation.error ? apiMessage(mutation.error) : undefined} />
            <PrimaryButton
              title="Confirmar reserva"
              loading={mutation.isPending}
              disabled={!context.session}
              icon={<Ionicons name="checkmark-circle-outline" size={21} color="#FFFFFF" />}
              onPress={submit}
            />
          </View>
          <View style={styles.note}>
            <Ionicons name="shield-checkmark-outline" size={19} color={colors.success} />
            <Text style={styles.noteText}>
              Las reglas de horario, cruces y límites semanales se validan automáticamente.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.background },
  topbar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  topSubtitle: { color: colors.muted, fontSize: 11, marginTop: 2 },
  content: { padding: 21, paddingBottom: 45, gap: 20 },
  intro: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  introIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introText: { flex: 1, gap: 4 },
  title: { color: colors.text, fontSize: 23, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 17,
  },
  spaceSummary: {
    borderRadius: 15,
    backgroundColor: colors.blueSoft,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },
  summaryBody: { flex: 1, gap: 4 },
  summaryTitle: { color: colors.text, fontSize: 12, lineHeight: 17, fontWeight: '700' },
  summaryRule: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  nextDayNotice: {
    borderRadius: 14,
    backgroundColor: colors.blueSoft,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  nextDayText: { color: colors.blue, fontSize: 12, lineHeight: 17, fontWeight: '700', flex: 1 },
  note: {
    borderRadius: 16,
    backgroundColor: colors.successSoft,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  noteText: { color: colors.success, fontSize: 12, lineHeight: 17, flex: 1 },
});
