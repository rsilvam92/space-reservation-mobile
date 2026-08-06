import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth/auth-store';
import { getApartments, getProfile, getSpaces } from '@/features/resident/resident-api';
import { queryKeys } from '@/core/query-keys';

export function useResidentContext() {
  const session = useAuthStore((state) => state.session);
  const profileQuery = useQuery({
    queryKey: queryKeys.profile(session?.id),
    queryFn: () => getProfile(session!.id),
    enabled: Boolean(session),
  });
  const apartmentsQuery = useQuery({
    queryKey: queryKeys.apartments,
    queryFn: getApartments,
    enabled: Boolean(session),
  });
  const spacesQuery = useQuery({
    queryKey: queryKeys.spaces,
    queryFn: getSpaces,
    enabled: Boolean(session),
  });

  const apartments = Array.isArray(apartmentsQuery.data) ? apartmentsQuery.data : [];
  const availableSpaces = Array.isArray(spacesQuery.data) ? spacesQuery.data : [];
  const apartment = apartments.find((item) => item.id === profileQuery.data?.apartamentoId);
  const condominium =
    apartment?.condominium ??
    (profileQuery.data?.condominioId
      ? {
          id: profileQuery.data.condominioId,
          nombre: profileQuery.data.condominio ?? 'Tu condominio',
        }
      : undefined);
  const spaces = availableSpaces.filter(
    (space) => !condominium?.id || space.condominium?.id === condominium.id,
  );

  return { session, profileQuery, apartmentsQuery, spacesQuery, apartment, condominium, spaces };
}
