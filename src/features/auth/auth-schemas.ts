import { z } from 'zod';

export const loginSchema = z.object({
  correo: z.email('Escribe un correo válido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registrationSchema = z.object({
  nombre: z.string().trim().min(2, 'Escribe tu nombre.'),
  apellido: z.string().trim().min(2, 'Escribe tu apellido.'),
  correo: z.email('Escribe un correo válido.'),
  documento: z.string().trim().min(5, 'Escribe un documento válido.'),
  telefono: z.string().trim().min(7, 'Escribe un teléfono válido.'),
  password: z.string().min(6, 'Usa al menos 6 caracteres.'),
  tipoOcupante: z.string().min(1, 'Selecciona el tipo de residente.'),
  condominioId: z.string().min(1, 'Selecciona tu condominio.'),
  torre: z.string().min(1, 'Selecciona tu torre.'),
  apartamentoId: z.string().min(1, 'Selecciona tu apartamento.'),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const REGISTRATION_DEFAULTS: RegistrationFormValues = {
  nombre: '',
  apellido: '',
  correo: '',
  documento: '',
  telefono: '',
  password: '',
  tipoOcupante: 'PROPIETARIO',
  condominioId: '',
  torre: '',
  apartamentoId: '',
};
