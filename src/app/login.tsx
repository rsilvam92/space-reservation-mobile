import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router, type Href } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/components/brand';
import { ErrorMessage } from '@/components/error-message';
import { FormField } from '@/components/form-field';
import { PrimaryButton } from '@/components/primary-button';
import { apiMessage } from '@/core/api';
import { login } from '@/features/auth/auth-api';
import { loginSchema, type LoginFormValues } from '@/features/auth/auth-schemas';
import { useAuthStore } from '@/features/auth/auth-store';

export default function LoginScreen() {
  const signIn = useAuthStore((state) => state.signIn);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { correo: '', password: '' },
  });
  const mutation = useMutation({
    mutationFn: ({ correo, password }: LoginFormValues) =>
      login(correo.trim().toLowerCase(), password),
    onSuccess: async (session) => {
      await signIn(session);
      router.replace('/(tabs)');
    },
  });

  return (
    <LinearGradient colors={['#10224A', '#2446BE', '#604EE8']} style={styles.background}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
            <View style={styles.hero}>
              <Brand light />
              <Text style={styles.heroTitle}>Tu comunidad, siempre a la mano.</Text>
              <Text style={styles.heroText}>
                Reserva espacios comunes y consulta tus solicitudes desde un solo lugar.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHead}>
                <Text style={styles.title}>Iniciar sesión</Text>
                <Text style={styles.subtitle}>Ingresa con los datos registrados en RESM.</Text>
              </View>
              <Controller
                control={control}
                name="correo"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormField
                    label="Correo electrónico"
                    placeholder="nombre@correo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.correo?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormField
                    label="Contraseña"
                    placeholder="Tu contraseña"
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="current-password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                  />
                )}
              />
              <ErrorMessage message={mutation.error ? apiMessage(mutation.error) : undefined} />
              <PrimaryButton
                title="Entrar a RESM"
                loading={mutation.isPending}
                onPress={handleSubmit((values) => mutation.mutate(values))}
              />
              <View style={styles.recoveryLinks}>
                <Link href={'/forgot-password' as Href} style={styles.link}>
                  Olvidé mi contraseña
                </Link>
                <Link href={'/forgot-account' as Href} style={styles.secondaryLink}>
                  No recuerdo mi correo
                </Link>
              </View>
              <Text style={styles.registerText}>
                ¿Aún no tienes cuenta?{' '}
                <Link href="/register" style={styles.link}>
                  Regístrate
                </Link>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, padding: 22, justifyContent: 'center', gap: 30 },
  hero: { gap: 14, paddingHorizontal: 6, paddingTop: 16 },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '900',
    maxWidth: 330,
    letterSpacing: -0.8,
  },
  heroText: { color: '#DDE5FF', fontSize: 15, lineHeight: 22, maxWidth: 340 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    gap: 17,
    shadowColor: '#06112C',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.24,
    shadowRadius: 26,
    elevation: 10,
  },
  cardHead: { gap: 6, marginBottom: 2 },
  title: { color: '#101A35', fontSize: 25, fontWeight: '900' },
  subtitle: { color: '#6D7894', fontSize: 14, lineHeight: 20 },
  registerText: { color: '#6D7894', fontSize: 14, textAlign: 'center', marginTop: 3 },
  link: { color: '#3558E8', fontWeight: '800' },
  secondaryLink: { color: '#6D7894', fontWeight: '700' },
  recoveryLinks: { alignItems: 'center', gap: 10 },
});
