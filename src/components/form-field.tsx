import { forwardRef } from 'react';
import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/constants/colors';

type Props = TextInputProps & { label: string; error?: string };

export const FormField = forwardRef<TextInput, Props>(({ label, error, style, ...props }, ref) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      ref={ref}
      placeholderTextColor="#9AA4BB"
      style={[styles.input, error ? styles.inputError : null, style]}
      {...props}
    />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
));

FormField.displayName = 'FormField';

const styles = StyleSheet.create({
  container: { gap: 7 },
  label: { color: colors.text, fontSize: 13, fontWeight: '700' },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 16,
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 12 },
});
