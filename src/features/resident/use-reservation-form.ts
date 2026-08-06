import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { queryClient } from '@/core/query-client';
import { queryKeys } from '@/core/query-keys';
import { createReservation } from './resident-api';
import { useResidentContext } from './resident-hooks';
import {
  crossesMidnight,
  reservationSchema,
  tomorrowValue,
  type ReservationFormValues,
} from './reservation-utils';

export function useReservationForm(onSuccess: () => void) {
  const [spaceOpen, setSpaceOpen] = useState(false);
  const context = useResidentContext();
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      spaceId: '',
      fecha: tomorrowValue(),
      horaInicio: '09:00',
      horaFin: '10:00',
    },
  });
  const spaceId = useWatch({ control: form.control, name: 'spaceId' });
  const reservationDate = useWatch({ control: form.control, name: 'fecha' });
  const startTime = useWatch({ control: form.control, name: 'horaInicio' });
  const endTime = useWatch({ control: form.control, name: 'horaFin' });
  const mutation = useMutation({
    mutationFn: (values: ReservationFormValues) => {
      if (!context.session) throw new Error('La sesión terminó. Ingresa nuevamente.');
      return createReservation({
        userId: context.session.id,
        spaceId: Number(values.spaceId),
        fecha: values.fecha,
        horaInicio: `${values.horaInicio}:00`,
        horaFin: `${values.horaFin}:00`,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.reservations(context.session?.id),
      });
      onSuccess();
    },
  });

  return {
    ...form,
    context,
    spaceOpen,
    setSpaceOpen,
    reservationDate,
    startTime,
    endTime,
    endsNextDay: crossesMidnight(startTime, endTime),
    selectedSpace: context.spaces.find((item) => item.id === Number(spaceId)),
    mutation,
    submit: form.handleSubmit((values) => mutation.mutate(values)),
  };
}
