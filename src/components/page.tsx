import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';

export function Page({
  title,
  subtitle,
  children,
  scroll = true,
  right,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  scroll?: boolean;
  right?: ReactNode;
}) {
  const content = (
    <>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
      {children}
    </>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content}>{content}</ScrollView>
      ) : (
        <View style={styles.content}>{content}</View>
      )}
    </SafeAreaView>
  );
}

export function LoadingState({ label = 'Cargando...' }: { label?: string }) {
  return (
    <View style={styles.state}>
      <ActivityIndicator size="large" color={colors.blue} />
      <Text style={styles.stateText}>{label}</Text>
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={28} color={colors.blue} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{description}</Text>
    </View>
  );
}

export function ErrorState({
  description,
  onRetry,
}: {
  description: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.errorIcon}>
        <Ionicons name="alert-circle-outline" size={28} color={colors.danger} />
      </View>
      <Text style={styles.emptyTitle}>No pudimos cargar la información</Text>
      <Text style={styles.emptyText}>{description}</Text>
      {onRetry ? (
        <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retry}>
          <Text style={styles.retryText}>Intentar nuevamente</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function RefreshButton({ onPress, loading }: { onPress: () => void; loading?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={loading} style={styles.refresh}>
      <Ionicons name="refresh" size={20} color={colors.blue} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 110, gap: 18 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  heading: { flex: 1, gap: 5 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', letterSpacing: -0.7 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  state: { minHeight: 240, alignItems: 'center', justifyContent: 'center', gap: 12 },
  stateText: { color: colors.muted, fontSize: 14 },
  empty: {
    minHeight: 240,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 9,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  errorIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  emptyText: { color: colors.muted, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  retry: {
    marginTop: 7,
    borderRadius: 12,
    backgroundColor: colors.blueSoft,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  retryText: { color: colors.blue, fontSize: 13, fontWeight: '800' },
  refresh: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
