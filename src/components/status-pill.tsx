import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';

const labels: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  EXPIRED: 'Vencida',
  ACTIVE: 'Activa',
};

export function StatusPill({ status }: { status: string }) {
  const normalized = status?.toUpperCase() ?? '';
  const tone =
    normalized === 'CONFIRMED' || normalized === 'ACTIVE'
      ? 'success'
      : normalized === 'PENDING'
        ? 'warning'
        : 'danger';
  return (
    <View style={[styles.pill, styles[`${tone}Pill`]]}>
      <Text style={[styles.text, styles[`${tone}Text`]]}>{labels[normalized] ?? status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'flex-start', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 },
  text: { fontSize: 11, fontWeight: '800' },
  successPill: { backgroundColor: colors.successSoft },
  warningPill: { backgroundColor: colors.warningSoft },
  dangerPill: { backgroundColor: colors.dangerSoft },
  successText: { color: colors.success },
  warningText: { color: colors.warning },
  dangerText: { color: colors.danger },
});
