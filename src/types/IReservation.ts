import { IUser } from '~/types';

export interface IReservation {
  id: string;
  dateTime: Date;
  duration: number;
  floor: string;
  area: string;
  lotNumber: number;
  reserver: string;
  plateNumber: string;
  earlyEnd: boolean;
  createdAt: Date;
}

export interface IPopulatedReservation extends IReservation {
  reserverData?: IUser;
}

export interface IUpdateReservationParams {
  id: string;
  reservation: Omit<IReservation, 'id'>;
}
