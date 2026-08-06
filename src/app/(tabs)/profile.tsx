import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ErrorState, LoadingState, Page } from '@/components/page';
import { colors } from '@/constants/colors';
import { apiMessage } from '@/core/api';
import { useAuthStore } from '@/features/auth/auth-store';
import { useResidentContext } from '@/features/resident/resident-hooks';

function Detail({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
}) {
  return (
    <View style={styles.detail}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={19} color={colors.blue} />
      </View>
      <View style={styles.detailText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || 'No registrado'}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const signOut = useAuthStore((state) => state.signOut);
  const context = useResidentContext();
  const profile = context.profileQuery.data;
  const logout = () =>
    Alert.alert('Cerrar sesión', '¿Deseas salir de RESM?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/login');
        },
      },
    ]);

  return (
    <Page title="Mi perfil" subtitle="Tu información de residente.">
      {context.profileQuery.isLoading ? (
        <LoadingState />
      ) : context.profileQuery.error ? (
        <ErrorState
          description={apiMessage(context.profileQuery.error)}
          onRetry={() => void context.profileQuery.refetch()}
        />
      ) : (
        <>
          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>
                {`${profile?.nombre?.[0] ?? ''}${profile?.apellido?.[0] ?? ''}`.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.name}>
              {profile ? `${profile.nombre} ${profile.apellido}` : context.session?.nombreCompleto}
            </Text>
            <Text style={styles.role}>{profile?.rol ?? context.session?.rol ?? 'RESIDENTE'}</Text>
          </View>
          <View style={styles.card}>
            <Detail
              icon="mail-outline"
              label="Correo"
              value={profile?.correo ?? context.session?.correo}
            />
            <Detail icon="card-outline" label="Documento" value={profile?.documento} />
            <Detail icon="call-outline" label="Teléfono" value={profile?.telefono} />
            <Detail icon="people-outline" label="Tipo de residente" value={profile?.tipoOcupante} />
            <Detail
              icon="business-outline"
              label="Condominio"
              value={profile?.condominio ?? context.condominium?.nombre}
            />
            <Detail
              icon="home-outline"
              label="Apartamento"
              value={
                context.apartment
                  ? `${context.apartment.sector} - ${context.apartment.numero}`
                  : profile?.apartamento
              }
            />
          </View>
          <Pressable style={styles.logout} onPress={logout}>
            <Ionicons name="log-out-outline" size={21} color={colors.danger} />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </Pressable>
          <Text style={styles.version}>
            RESM móvil · Versión {Constants.expoConfig?.version ?? '1.0.0'}
          </Text>
        </>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', gap: 5, paddingVertical: 8 },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 27,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 15,
    elevation: 5,
  },
  initials: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  name: { color: colors.text, fontSize: 21, fontWeight: '900' },
  role: { color: colors.blue, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 23,
    paddingHorizontal: 17,
  },
  detail: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: { flex: 1, gap: 3 },
  label: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  value: { color: colors.text, fontSize: 14, fontWeight: '700' },
  logout: {
    minHeight: 54,
    borderRadius: 17,
    backgroundColor: colors.dangerSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  logoutText: { color: colors.danger, fontSize: 15, fontWeight: '800' },
  version: { color: colors.muted, fontSize: 11, textAlign: 'center' },
});
