import { create } from 'zustand';

import { registerUnauthorizedHandler, setAccessToken } from '@/core/auth-token';
import { queryClient } from '@/core/query-client';
import type { Session } from '@/types/api';
import { sessionRepository } from './session-repository';

type AuthState = {
  hydrated: boolean;
  session: Session | null;
  hydrate: () => Promise<void>;
  signIn: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  hydrated: false,
  session: null,
  hydrate: async () => {
    try {
      const session = await sessionRepository.load();
      setAccessToken(session?.token ?? null);
      set({ session, hydrated: true });
    } catch {
      await sessionRepository.clear();
      setAccessToken(null);
      set({ session: null, hydrated: true });
    }
  },
  signIn: async (session) => {
    await sessionRepository.save(session);
    setAccessToken(session.token);
    set({ session });
  },
  signOut: async () => {
    await sessionRepository.clear();
    setAccessToken(null);
    queryClient.clear();
    set({ session: null });
  },
}));

registerUnauthorizedHandler(() => {
  void useAuthStore.getState().signOut();
});
