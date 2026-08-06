import { api, asArray } from '@/core/api';
import type { Apartment, Reservation, Space, UserProfile } from '@/types/api';

type UserProfileResponse = UserProfile & {
  apartment?: Apartment;
  role?: { nombre?: string };
};

export async function getProfile(userId: number) {
  const response = await api.get<UserProfileResponse>(`/users/${userId}`);
  const profile = response.data;
  const apartment = profile.apartment;
  return {
    ...profile,
    rol: profile.rol ?? profile.role?.nombre,
    apartamentoId: profile.apartamentoId ?? apartment?.id,
    apartamento:
      profile.apartamento ?? (apartment ? `${apartment.sector} - ${apartment.numero}` : undefined),
    condominioId: profile.condominioId ?? apartment?.condominium?.id,
    condominio: profile.condominio ?? apartment?.condominium?.nombre,
  };
}

export async function getSpaces(): Promise<Space[]> {
  const response = await api.get<unknown>('/spaces');
  return asArray<Space>(response.data);
}

export async function getApartments(): Promise<Apartment[]> {
  const response = await api.get<unknown>('/apartments');
  return asArray<Apartment>(response.data);
}

export async function getReservations(userId: number): Promise<Reservation[]> {
  const response = await api.get<unknown>(`/reservations/user/${userId}`);
  return asArray<Reservation>(response.data);
}
export type ReservationPayload = {
  userId: number;
  spaceId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
};

export async function createReservation(payload: ReservationPayload): Promise<Reservation> {
  const response = await api.post<Reservation>('/reservations', payload);
  return response.data;
}

export async function cancelReservation(reservationId: number): Promise<void> {
  await api.delete(`/reservations/${reservationId}`);
}
