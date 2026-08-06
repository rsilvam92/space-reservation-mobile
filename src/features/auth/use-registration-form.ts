import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { register } from './auth-api';
import {
  REGISTRATION_DEFAULTS,
  registrationSchema,
  type RegistrationFormValues,
} from './auth-schemas';
import { useRegistrationOptions } from './use-registration-options';

export function useRegistrationForm(onSuccess: () => void) {
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: REGISTRATION_DEFAULTS,
  });
  const condominiumId = useWatch({ control: form.control, name: 'condominioId' });
  const tower = useWatch({ control: form.control, name: 'torre' });
  const options = useRegistrationOptions(condominiumId, tower);
  const mutation = useMutation({
    mutationFn: (values: RegistrationFormValues) =>
      register({
        nombre: values.nombre,
        apellido: values.apellido,
        correo: values.correo.trim().toLowerCase(),
        documento: values.documento,
        password: values.password,
        telefono: values.telefono,
        tipoOcupante: values.tipoOcupante,
        condominioId: Number(values.condominioId),
        apartamentoId: Number(values.apartamentoId),
      }),
    onSuccess,
  });

  return {
    ...form,
    ...options,
    condominiumId,
    tower,
    openSelect,
    setOpenSelect,
    mutation,
    submit: form.handleSubmit((values) => mutation.mutate(values)),
  };
}
