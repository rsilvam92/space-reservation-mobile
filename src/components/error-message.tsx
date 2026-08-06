import { StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/colors';

export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <Text style={styles.message}>{message}</Text>;
}

const styles = StyleSheet.create({
  message: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    lineHeight: 18,
  },
});
