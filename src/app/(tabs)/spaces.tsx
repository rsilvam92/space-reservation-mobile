import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { EmptyState, ErrorState, LoadingState, Page, RefreshButton } from '@/components/page';
import { StatusPill } from '@/components/status-pill';
import { colors } from '@/constants/colors';
import { apiMessage } from '@/core/api';
import { useResidentContext } from '@/features/resident/resident-hooks';
import { spaceTypeIcon, spaceTypeLabel } from '@/features/resident/space-utils';
import type { Space } from '@/types/api';

function SpaceCard({ space }: { space: Space }) {
  const config = space.configuracion;
  return (
    <View style={styles.card}>
      <View style={styles.image}>
        <Ionicons name={spaceTypeIcon(space.tipo)} size={31} color={colors.blue} />
      </View>
      <View style={styles.body}>
        <View style={styles.head}>
          <View style={styles.titleBlock}>
            <Text style={styles.name}>{space.nombre}</Text>
            <Text style={styles.type}>{spaceTypeLabel(space.tipo)}</Text>
          </View>
          <StatusPill status={space.activo ? 'ACTIVE' : 'INACTIVE'} />
        </View>
        {space.descripcion ? <Text style={styles.description}>{space.descripcion}</Text> : null}
        <View style={styles.rules}>
          <View style={styles.rule}>
            <Ionicons name="time-outline" size={16} color={colors.muted} />
            <Text style={styles.ruleText}>
              {config?.maxHorasReserva ? `Máx. ${config.maxHorasReserva} h` : 'Horario flexible'}
            </Text>
          </View>
          <View style={styles.rule}>
            <Ionicons name="calendar-outline" size={16} color={colors.muted} />
            <Text style={styles.ruleText}>
              {config?.maxReservasSemana
                ? `${config.maxReservasSemana} por semana`
                : 'Sin límite semanal'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function SpacesScreen() {
  const context = useResidentContext();
  const activeSpaces = context.spaces.filter((space) => space.activo);
  const refresh = () =>
    void Promise.all([
      context.spacesQuery.refetch(),
      context.apartmentsQuery.refetch(),
      context.profileQuery.refetch(),
    ]);
  return (
    <Page
      title="Espacios"
      subtitle={`Zonas comunes de ${context.condominium?.nombre ?? 'tu comunidad'}.`}
      right={<RefreshButton onPress={refresh} loading={context.spacesQuery.isFetching} />}
    >
      {context.spacesQuery.isLoading ? (
        <LoadingState label="Consultando espacios..." />
      ) : context.spacesQuery.error ? (
        <ErrorState
          description={apiMessage(context.spacesQuery.error)}
          onRetry={() => void context.spacesQuery.refetch()}
        />
      ) : activeSpaces.length ? (
        <View style={styles.list}>
          {activeSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="business-outline"
          title="No hay espacios disponibles"
          description="El administrador aún no ha configurado zonas comunes para tu condominio."
        />
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  list: { gap: 13 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 23,
    overflow: 'hidden',
  },
  image: {
    height: 92,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: 17, gap: 13 },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleBlock: { flex: 1, gap: 3 },
  name: { color: colors.text, fontSize: 17, fontWeight: '900' },
  type: { color: colors.blue, fontSize: 12, fontWeight: '700' },
  description: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  rules: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ruleText: { color: colors.muted, fontSize: 12 },
});
