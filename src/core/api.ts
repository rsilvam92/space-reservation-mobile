import { create, isAxiosError } from 'axios';
import { Platform } from 'react-native';

import { getAccessToken, handleUnauthorized } from './auth-token';

const localApiUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080/api' : 'http://localhost:8080/api';

export const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? localApiUrl,
  timeout: 12_000,
  headers: { 'Content-Type': 'application/json' },
});

export function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (!value || typeof value !== 'object') return [];

  const record = value as Record<string, unknown>;
  for (const key of ['content', 'data', 'items', 'results']) {
    if (Array.isArray(record[key])) return record[key] as T[];
  }

  return 'id' in record ? [record as T] : [];
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  },
);

export function apiMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'string') return data;
    if (data?.message) return String(data.message);
    if (data && typeof data === 'object') {
      const messages = Object.values(data).filter(
        (value): value is string => typeof value === 'string',
      );
      if (messages.length) return messages.join(' ');
    }
    if (error.code === 'ECONNABORTED') return 'La conexión tardó demasiado. Intenta nuevamente.';
    if (!error.response)
      return 'No pudimos conectar con RESM. Verifica que el servidor esté encendido.';
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Ocurrió un problema inesperado. Intenta nuevamente.';
}
