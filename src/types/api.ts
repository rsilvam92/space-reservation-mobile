export type Session = {
  id: number;
  correo: string;
  nombreCompleto: string;
  rol: string;
  token: string;
};

export type Condominium = {
  id: number;
  nombre: string;
  ciudad?: string;
  direccion?: string;
  activo?: boolean;
};

export type Apartment = {
  id: number;
  sector: string;
  numero: string;
  estado?: string;
  codigo?: string;
  condominium?: Condominium;
};

export type UserProfile = {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  documento: string;
  telefono?: string;
  tipoOcupante?: string;
  estado: string;
  rol?: string;
  apartamentoId?: number;
  apartamento?: string;
  condominioId?: number;
  condominio?: string;
};

export type Space = {
  id: number;
  nombre: string;
  descripcion?: string;
  tipo: string;
  activo: boolean;
  condominium?: Condominium;
  configuracion?: {
    maxHorasReserva?: number;
    maxReservasSemana?: number;
    requiereConfirmacion?: boolean;
    minutosConfirmacion?: number;
    horaInicio?: string;
    horaFin?: string;
  };
};

export type Reservation = {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
  user?: { id: number; nombre?: string; apellido?: string };
  space?: Space;
  fechaReserva?: string;
};

export type RegistrationApartment = Pick<Apartment, 'id' | 'sector' | 'numero' | 'estado'>;
