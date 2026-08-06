import { api, asArray } from '@/core/api';
import type { Condominium, RegistrationApartment, Session } from '@/types/api';

export type RegistrationPayload = {
  nombre: string;
  apellido: string;
  correo: string;
  documento: string;
  password: string;
  telefono?: string;
  tipoOcupante: string;
  condominioId: number;
  apartamentoId: number;
};

export async function login(correo: string, password: string): Promise<Session> {
  const response = await api.post<Session>('/auth/login', { correo, password });
  if (!response.data.id || !response.data.correo) {
    throw new Error(
      'El backend debe reiniciarse para completar la actualización del inicio de sesión.',
    );
  }
  return response.data;
}

export async function register(payload: RegistrationPayload) {
  const response = await api.post('/users/register', payload);
  return response.data;
}

export async function getRegistrationCondominiums(): Promise<Condominium[]> {
  const response = await api.get<unknown>('/users/register/condominiums');
  return asArray<Condominium>(response.data);
}

export async function getRegistrationApartments(
  condominiumId: number,
): Promise<RegistrationApartment[]> {
  const response = await api.get<unknown>(
    `/users/register/condominiums/${condominiumId}/apartments`,
  );
  return asArray<RegistrationApartment>(response.data);
}

export async function requestPasswordReset(email: string): Promise<string> {
  const response = await api.post<{ message: string }>('/auth/password-reset/request', { email });
  return response.data.message;
}

export async function requestAccountReminder(payload: {
  documento: string;
  condominiumId: number;
  apartmentId: number;
}): Promise<{ message: string; maskedEmail?: string }> {
  const response = await api.post<{ message: string; maskedEmail?: string }>(
    '/auth/account-reminder',
    payload,
  );
  return response.data;
}
