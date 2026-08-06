import { deleteSecureItem, getSecureItem, saveSecureItem } from '@/core/storage';
import type { Session } from '@/types/api';

const SESSION_KEY = 'resm.session';

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') return false;
  const session = value as Partial<Session>;
  return (
    typeof session.id === 'number' &&
    typeof session.correo === 'string' &&
    typeof session.nombreCompleto === 'string' &&
    typeof session.rol === 'string' &&
    typeof session.token === 'string' &&
    session.token.length > 0
  );
}

export const sessionRepository = {
  async load(): Promise<Session | null> {
    const stored = await getSecureItem(SESSION_KEY);
    if (!stored) return null;

    try {
      const parsed: unknown = JSON.parse(stored);
      if (isSession(parsed)) return parsed;
    } catch {
      // Invalid local state is removed below.
    }

    await deleteSecureItem(SESSION_KEY);
    return null;
  },

  async save(session: Session): Promise<void> {
    await saveSecureItem(SESSION_KEY, JSON.stringify(session));
  },

  async clear(): Promise<void> {
    await deleteSecureItem(SESSION_KEY);
  },
};
