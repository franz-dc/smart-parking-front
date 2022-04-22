import { IReservation, IRates } from '~/types';

export const getReservationAmount = (
  reservation: IReservation | Omit<IReservation, 'id'>,
  rates: IRates
): number => rates.reservationFee + reservation.duration * rates.parkingRate;
