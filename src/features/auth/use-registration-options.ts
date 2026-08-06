import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/core/query-keys';
import { getRegistrationApartments, getRegistrationCondominiums } from './auth-api';

export function useRegistrationOptions(condominiumId: string, tower: string) {
  const condominiumsQuery = useQuery({
    queryKey: queryKeys.registration.condominiums,
    queryFn: getRegistrationCondominiums,
  });
  const apartmentsQuery = useQuery({
    queryKey: queryKeys.registration.apartments(condominiumId),
    queryFn: () => getRegistrationApartments(Number(condominiumId)),
    enabled: Boolean(condominiumId),
  });

  const condominiumOptions = useMemo(
    () =>
      (condominiumsQuery.data ?? []).map((item) => ({
        label: `${item.id} - ${item.nombre}${item.ciudad ? ` · ${item.ciudad}` : ''}`,
        value: String(item.id),
      })),
    [condominiumsQuery.data],
  );
  const towerOptions = useMemo(
    () =>
      Array.from(
        new Set((apartmentsQuery.data ?? []).map((item) => item.sector.trim()).filter(Boolean)),
      )
        .sort((first, second) => first.localeCompare(second, 'es', { numeric: true }))
        .map((sector) => ({ label: sector, value: sector })),
    [apartmentsQuery.data],
  );
  const apartmentOptions = useMemo(
    () =>
      (apartmentsQuery.data ?? [])
        .filter((item) => item.sector.trim() === tower)
        .sort((first, second) => first.numero.localeCompare(second.numero, 'es', { numeric: true }))
        .map((item) => ({
          label: `Apartamento ${item.numero}`,
          value: String(item.id),
        })),
    [apartmentsQuery.data, tower],
  );

  return {
    condominiumsQuery,
    apartmentsQuery,
    condominiumOptions,
    towerOptions,
    apartmentOptions,
  };
}
