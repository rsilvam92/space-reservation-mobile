import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';

type Mode = 'date' | 'time';

function parseValue(value: string, mode: Mode) {
  if (mode === 'date') {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  }
  const [hour, minute] = value.split(':').map(Number);
  return new Date(2000, 0, 1, hour, minute, 0);
}

function serializeValue(value: Date, mode: Mode) {
  if (mode === 'date') {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  }
  return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
}

function displayValue(value: string, mode: Mode) {
  const date = parseValue(value, mode);
  if (mode === 'date') {
    return new Intl.DateTimeFormat('es-CO', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function DateTimeField({
  label,
  value,
  mode,
  onChange,
  minimumDate,
  error,
}: {
  label: string;
  value: string;
  mode: Mode;
  onChange: (value: string) => void;
  minimumDate?: Date;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const picker = (
    <DateTimePicker
      value={parseValue(value, mode)}
      mode={mode}
      display={mode === 'date' ? 'calendar' : 'clock'}
      presentation="dialog"
      is24Hour
      minimumDate={mode === 'date' ? minimumDate : undefined}
      accentColor={colors.blue}
      positiveButton={{ label: 'Aceptar' }}
      negativeButton={{ label: 'Cancelar' }}
      onValueChange={(_event, date) => {
        onChange(serializeValue(date, mode));
        setOpen(false);
      }}
      onDismiss={() => setOpen(false)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.field, error ? styles.fieldError : null]}
      >
        <Ionicons
          name={mode === 'date' ? 'calendar-outline' : 'time-outline'}
          size={19}
          color={colors.blue}
        />
        <Text style={styles.value}>{displayValue(value, mode)}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.muted} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {open && Platform.OS === 'android' ? picker : null}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={open}
          transparent
          animationType="slide"
          onRequestClose={() => setOpen(false)}
        >
          <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
            <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
              <View style={styles.sheetHead}>
                <Text style={styles.sheetTitle}>{label}</Text>
                <Pressable onPress={() => setOpen(false)}>
                  <Text style={styles.done}>Listo</Text>
                </Pressable>
              </View>
              {picker}
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 7 },
  label: { color: colors.text, fontSize: 13, fontWeight: '700' },
  field: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  fieldError: { borderColor: colors.danger },
  value: { color: colors.text, fontSize: 14, flex: 1, textTransform: 'capitalize' },
  error: { color: colors.danger, fontSize: 12 },
  overlay: { flex: 1, backgroundColor: 'rgba(8,18,43,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    paddingBottom: 34,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sheetTitle: { color: colors.text, fontSize: 19, fontWeight: '900' },
  done: { color: colors.blue, fontSize: 15, fontWeight: '800' },
});
