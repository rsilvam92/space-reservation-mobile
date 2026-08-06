import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';

export function Brand({ light = false }: { light?: boolean }) {
  const color = light ? '#FFFFFF' : colors.navy;
  return (
    <View style={styles.row}>
      <View style={[styles.mark, { backgroundColor: color }]}>
        <Ionicons name="home" color={light ? colors.blue : '#FFFFFF'} size={24} />
      </View>
      <View>
        <Text style={[styles.eyebrow, { color }]}>RESERVAS</Text>
        <Text style={[styles.wordmark, { color }]}>RESM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 2.1 },
  wordmark: { fontSize: 28, lineHeight: 29, fontWeight: '900', letterSpacing: 1 },
});
