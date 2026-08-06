import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ErrorMessage } from '@/components/error-message';
import { FormField } from '@/components/form-field';
import { Page } from '@/components/page';
import { PrimaryButton } from '@/components/primary-button';
import { SelectField } from '@/components/select-field';
import { colors } from '@/constants/colors';
import { apiMessage } from '@/core/api';
import { requestAccountReminder } from '@/features/auth/auth-api';
import { useRegistrationOptions } from '@/features/auth/use-registration-options';

type SelectName = 'condominium' | 'tower' | 'apartment' | null;

export default function ForgotAccountScreen() {
  const [documento, setDocumento] = useState('');
  const [condominiumId, setCondominiumId] = useState('');
  const [tower, setTower] = useState('');
  const [apartmentId, setApartmentId] = useState('');
  const [openSelect, setOpenSelect] = useState<SelectName>(null);
  const options = useRegistrationOptions(condominiumId, tower);
  const mutation = useMutation({
    mutationFn: () =>
      requestAccountReminder({
        documento: documento.trim(),
        condominiumId: Number(condominiumId),
        apartmentId: Number(apartmentId),
      }),
  });

  const complete = documento.trim() && condominiumId && tower && apartmentId;
  return (
    <Page
      title="Recordar mi correo"
      subtitle="Confirma tu documento, condominio y apartamento. Nunca mostraremos el correo completo."
    >
      <View style={styles.card}>
        {mutation.data ? (
          <Text style={styles.success}>
            {mutation.data.message}
            {mutation.data.maskedEmail ? `\nCorreo: ${mutation.data.maskedEmail}` : ''}
          </Text>
        ) : null}
        <FormField
          label="Documento"
          placeholder="Número de identificación"
          keyboardType="number-pad"
          value={documento}
          onChangeText={setDocumento}
        />
        <SelectField
          label="Condominio"
          value={condominiumId}
          options={options.condominiumOptions}
          placeholder={
            options.condominiumsQuery.isLoading ? 'Cargando...' : 'Selecciona tu condominio'
          }
          open={openSelect === 'condominium'}
          onOpen={() => setOpenSelect('condominium')}
          onClose={() => setOpenSelect(null)}
          onChange={(value) => {
            setCondominiumId(value);
            setTower('');
            setApartmentId('');
          }}
        />
        <SelectField
          label="Torre o sector"
          value={tower}
          options={options.towerOptions}
          placeholder={condominiumId ? 'Selecciona la torre' : 'Primero selecciona el condominio'}
          disabled={!condominiumId}
          open={openSelect === 'tower'}
          onOpen={() => setOpenSelect('tower')}
          onClose={() => setOpenSelect(null)}
          onChange={(value) => {
            setTower(value);
            setApartmentId('');
          }}
        />
        <SelectField
          label="Apartamento"
          value={apartmentId}
          options={options.apartmentOptions}
          placeholder={tower ? 'Selecciona el apartamento' : 'Primero selecciona la torre'}
          disabled={!tower}
          open={openSelect === 'apartment'}
          onOpen={() => setOpenSelect('apartment')}
          onClose={() => setOpenSelect(null)}
          onChange={setApartmentId}
        />
        <ErrorMessage message={mutation.error ? apiMessage(mutation.error) : undefined} />
        <PrimaryButton
          title="Enviar recordatorio"
          loading={mutation.isPending}
          disabled={!complete || Boolean(mutation.data)}
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
