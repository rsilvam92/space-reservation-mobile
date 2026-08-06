export const queryKeys = {
  profile: (userId?: number) => ['profile', userId] as const,
  apartments: ['apartments'] as const,
  spaces: ['spaces'] as const,
  reservations: (userId?: number) => ['reservations', userId] as const,
  registration: {
    condominiums: ['registration', 'condominiums'] as const,
    apartments: (condominiumId?: string) => ['registration', 'apartments', condominiumId] as const,
  },
} as const;
