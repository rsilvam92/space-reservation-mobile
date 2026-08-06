import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/colors';

export function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  icon,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  const inactive = loading || disabled;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        inactive && styles.disabled,
        pressed && !inactive && styles.pressed,
      ]}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" /> : icon}
      {!loading ? <Text style={styles.text}>{title}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  disabled: { opacity: 0.55 },
  pressed: { transform: [{ scale: 0.985 }] },
  text: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
