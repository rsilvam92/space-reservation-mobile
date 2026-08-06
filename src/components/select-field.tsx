import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';

export type SelectOption = { label: string; value: string };

export function SelectField({
  label,
  value,
  options,
  placeholder,
  open,
  onOpen,
  onClose,
  onChange,
  disabled,
  error,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}) {
  const selected = options.find((option) => option.value === value);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        disabled={disabled}
        onPress={onOpen}
        style={[styles.field, error ? styles.fieldError : null, disabled ? styles.disabled : null]}
      >
        <Text style={selected ? styles.value : styles.placeholder}>
          {selected?.label ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={19} color={colors.muted} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <View style={styles.handle} />
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <Pressable onPress={onClose} hitSlop={12}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.options}>
              {options.map((option) => {
                const active = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      onClose();
                    }}
                    style={[styles.option, active && styles.optionActive]}
                  >
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>
                      {option.label}
                    </Text>
                    {active ? (
                      <Ionicons name="checkmark-circle" size={22} color={colors.blue} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
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
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldError: { borderColor: colors.danger },
  disabled: { opacity: 0.5 },
  value: { color: colors.text, fontSize: 16, flex: 1 },
  placeholder: { color: '#9AA4BB', fontSize: 16, flex: 1 },
  error: { color: colors.danger, fontSize: 12 },
  overlay: { flex: 1, backgroundColor: 'rgba(8,18,43,0.5)', justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '70%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 18,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sheetTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  options: { gap: 8, paddingBottom: 20 },
  option: {
    minHeight: 54,
    borderRadius: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionActive: { backgroundColor: colors.blueSoft },
  optionText: { color: colors.text, fontSize: 15, flex: 1 },
  optionTextActive: { color: colors.blue, fontWeight: '800' },
});
