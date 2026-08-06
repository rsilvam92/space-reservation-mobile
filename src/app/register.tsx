import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Controller } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/components/brand';
import { ErrorMessage } from '@/components/error-message';
import { FormField } from '@/components/form-field';
import { PrimaryButton } from '@/components/primary-button';
import { SelectField } from '@/components/select-field';
import { colors } from '@/constants/colors';
import { apiMessage } from '@/core/api';
import { useRegistrationForm } from '@/features/auth/use-registration-form';

export default function RegisterScreen() {
  const {
    control,
    setValue,
    formState: { errors },
    condominiumId,
    tower,
    condominiumsQuery,
    apartmentsQuery,
    condominiumOptions,
    towerOptions,
    apartmentOptions,
    openSelect,
    setOpenSelect,
    mutation,
    submit,
  } = useRegistrationForm(() =>
    Alert.alert(
      'Solicitud enviada',
      'Tu registro quedó pendiente de aprobación por el administrador.',
      [{ text: 'Entendido', onPress: () => router.replace('/login') }],
    ),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.topbar}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={colors.navy} />
          </Pressable>
          <Brand />
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <View style={styles.heading}>
            <Text style={styles.title}>Crea tu cuenta</Text>
            <Text style={styles.subtitle}>
              Selecciona el condominio y apartamento donde resides. El administrador validará tu
              solicitud.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.half}>
                <Controller
                  control={control}
                  name="nombre"
                  render={({ field }) => (
                    <FormField
                      label="Nombre"
                      placeholder="Tu nombre"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.nombre?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.half}>
                <Controller
                  control={control}
                  name="apellido"
                  render={({ field }) => (
                    <FormField
                      label="Apellido"
                      placeholder="Tu apellido"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.apellido?.message}
                    />
                  )}
                />
              </View>
            </View>
            <Controller
              control={control}
              name="correo"
              render={({ field }) => (
                <FormField
                  label="Correo electrónico"
                  placeholder="nombre@correo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.correo?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="documento"
              render={({ field }) => (
                <FormField
                  label="Documento"
                  placeholder="Número de identificación"
                  keyboardType="number-pad"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.documento?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="telefono"
              render={({ field }) => (
                <FormField
                  label="Teléfono"
                  placeholder="Número de contacto"
                  keyboardType="phone-pad"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.telefono?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="condominioId"
              render={({ field }) => (
                <SelectField
                  label="Condominio"
                  placeholder={
                    condominiumsQuery.isLoading
                      ? 'Cargando condominios...'
                      : 'Selecciona tu condominio'
                  }
                  value={field.value}
                  options={condominiumOptions}
                  open={openSelect === 'condominium'}
                  onOpen={() => setOpenSelect('condominium')}
                  onClose={() => setOpenSelect(null)}
                  onChange={(value) => {
                    field.onChange(value);
                    setValue('torre', '');
                    setValue('apartamentoId', '');
                  }}
                  error={
                    errors.condominioId?.message ??
                    (condominiumsQuery.error ? apiMessage(condominiumsQuery.error) : undefined)
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="torre"
              render={({ field }) => (
                <SelectField
                  label="Torre"
                  placeholder={
                    !condominiumId
                      ? 'Primero selecciona un condominio'
                      : apartmentsQuery.isLoading
                        ? 'Cargando torres...'
                        : 'Selecciona tu torre'
                  }
                  value={field.value}
                  options={towerOptions}
                  open={openSelect === 'tower'}
                  onOpen={() => setOpenSelect('tower')}
                  onClose={() => setOpenSelect(null)}
                  onChange={(value) => {
                    field.onChange(value);
                    setValue('apartamentoId', '');
                  }}
                  disabled={!condominiumId || apartmentsQuery.isLoading}
                  error={
                    errors.torre?.message ??
                    (apartmentsQuery.error ? apiMessage(apartmentsQuery.error) : undefined)
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="apartamentoId"
              render={({ field }) => (
                <SelectField
                  label="Apartamento"
                  placeholder={
                    !tower ? 'Primero selecciona una torre' : 'Selecciona tu apartamento'
                  }
                  value={field.value}
                  options={apartmentOptions}
                  open={openSelect === 'apartment'}
                  onOpen={() => setOpenSelect('apartment')}
                  onClose={() => setOpenSelect(null)}
                  onChange={field.onChange}
                  disabled={!tower}
                  error={errors.apartamentoId?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="tipoOcupante"
              render={({ field }) => (
                <SelectField
                  label="Tipo de residente"
                  placeholder="Selecciona una opción"
                  value={field.value}
                  options={[
                    { label: 'Propietario', value: 'PROPIETARIO' },
                    { label: 'Arrendatario', value: 'ARRENDATARIO' },
                  ]}
                  open={openSelect === 'occupant'}
                  onOpen={() => setOpenSelect('occupant')}
                  onClose={() => setOpenSelect(null)}
                  onChange={field.onChange}
                  error={errors.tipoOcupante?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormField
                  label="Contraseña"
                  placeholder="Mínimo 6 caracteres"
                  secureTextEntry
                  autoCapitalize="none"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.password?.message}
                />
              )}
            />
            <ErrorMessage message={mutation.error ? apiMessage(mutation.error) : undefined} />
            <PrimaryButton title="Enviar solicitud" loading={mutation.isPending} onPress={submit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.background },
  topbar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 22, paddingBottom: 44, gap: 24 },
  heading: { gap: 7 },
  title: { color: colors.text, fontSize: 29, fontWeight: '900', letterSpacing: -0.7 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 19,
    gap: 17,
  },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
});
