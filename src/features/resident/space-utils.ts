import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

const SPACE_TYPE_LABELS: Record<string, string> = {
  COWORK: 'Cowork',
  SOCIAL_HALL: 'Salón social',
  SAUNA: 'Sauna',
  TURKISH_BATH: 'Turco',
  PADEL_COURT: 'Cancha de pádel',
  MULTIPURPOSE_COURT: 'Cancha múltiple',
  SOCCER_FIELD: 'Cancha de fútbol',
  GYM: 'Gimnasio',
  POOL: 'Piscina',
  BBQ_AREA: 'Zona BBQ',
  GAME_ROOM: 'Sala de juegos',
  PLAYGROUND: 'Parque infantil',
};

const SPACE_TYPE_ICONS: Record<string, ComponentProps<typeof Ionicons>['name']> = {
  COWORK: 'laptop-outline',
  SAUNA: 'water-outline',
  TURKISH_BATH: 'water-outline',
  PADEL_COURT: 'tennisball-outline',
  MULTIPURPOSE_COURT: 'basketball-outline',
  SOCCER_FIELD: 'football-outline',
  GYM: 'barbell-outline',
  POOL: 'water-outline',
  BBQ_AREA: 'flame-outline',
  GAME_ROOM: 'game-controller-outline',
  PLAYGROUND: 'happy-outline',
};

export function spaceTypeLabel(type: string): string {
  return SPACE_TYPE_LABELS[type] ?? type;
}

export function spaceTypeIcon(type: string): ComponentProps<typeof Ionicons>['name'] {
  return SPACE_TYPE_ICONS[type] ?? 'people-outline';
}
