import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ErrorMessage } from '@/components/error-message';
import { FormField } from '@/components/form-field';
import { Page } from '@/components/page';
import { PrimaryButton } from '@/components/primary-button';
import { colors } from '@/constants/colors';
import { apiMessage } from '@/core/api';
import { requestPasswordReset } from '@/features/auth/auth-api';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const mutation = useMutation({
    mutationFn: () => requestPasswordReset(email.trim().toLowerCase()),
  });

  return (
    <Page
      title="Recuperar contraseña"
      subtitle="Recibirás un enlace temporal en el correo de tu cuenta."
    >
      <View style={styles.card}>
        {mutation.data ? <Text style={styles.success}>{mutation.data}</Text> : null}
        <FormField
          label="Correo electrónico"
          placeholder="nombre@correo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <ErrorMessage message={mutation.error ? apiMessage(mutation.error) : undefined} />
        <PrimaryButton
          title="Enviar instrucciones"
          loading={mutation.isPending}
          disabled={!email.trim() || Boolean(mutation.data)}
          onPress={() => mutation.mutate()}
        />
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Volver al inicio de sesión</Text>
        </Pressable>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 17,
  },
  success: {
    color: colors.success,
    backgroundColor: colors.successSoft,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
  },
  back: { color: colors.blue, fontWeight: '800', textAlign: 'center', padding: 8 },
});
