import { IReservation, IRate } from 'types';

export const getReservationAmount = (
  reservation: IReservation | Omit<IReservation, 'id'>,
  rates: IRate
): number => rates.reservationFee + reservation.duration * rates.parkingRate;
