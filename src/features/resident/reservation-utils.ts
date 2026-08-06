import { z } from 'zod';

export const reservationSchema = z
  .object({
    spaceId: z.string().min(1, 'Selecciona un espacio.'),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD.'),
    horaInicio: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Usa el formato HH:MM.'),
    horaFin: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Usa el formato HH:MM.'),
  })
  .refine((data) => data.horaFin !== data.horaInicio, {
    message: 'La hora inicial y la hora final deben ser diferentes.',
    path: ['horaFin'],
  });

export type ReservationFormValues = z.infer<typeof reservationSchema>;

export function toLocalDateValue(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function tomorrowValue(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toLocalDateValue(date);
}

export function reservationMinimumDate(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function crossesMidnight(startTime: string, endTime: string): boolean {
  return Boolean(startTime && endTime && endTime < startTime);
}

export function nextDaySummary(dateValue: string, endTime: string): string {
  const [year, month, day] = dateValue.split('-').map(Number);
  const nextDay = new Date(year, month - 1, day + 1, 12, 0, 0);
  const formattedDay = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(nextDay);
  return `Finaliza el ${formattedDay} a las ${endTime} (día siguiente).`;
}

export function formatReservationDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function reservationDuration(start: string, end: string): string {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const startTotal = startHour * 60 + startMinute;
  let endTotal = endHour * 60 + endMinute;
  if (endTotal < startTotal) endTotal += 24 * 60;

  const total = endTotal - startTotal;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (!hours) return `${minutes} min`;
  return minutes ? `${hours} h ${minutes} min` : `${hours} h`;
}
