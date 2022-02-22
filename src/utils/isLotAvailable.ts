import { IReservation } from 'types';
import { add, isWithinInterval } from 'date-fns';

export const isLotAvailable = (
  reservations: IReservation[],
  newReservation: IReservation | Omit<IReservation, 'id'>
): boolean => {
  // this function assumes that the filtered reservations are of the same lot

  const newReservationStartTime = newReservation.dateTime;
  const newReservationEndTime = add(newReservationStartTime, {
    minutes: newReservation.duration,
  });

  // end the function early if there are no reservations
  if (reservations.length === 0) return true;

  // run through the existing reservations and check if the new reservation
  // overlaps with any of them
  let isAvailable = true;

  reservations.forEach((reservation) => {
    const startTime = reservation.dateTime;
    const endTime = add(startTime, { minutes: reservation.duration });

    console.log({
      start: isWithinInterval(newReservationStartTime, {
        start: startTime,
        end: endTime,
      }),
      end: isWithinInterval(newReservationEndTime, {
        start: startTime,
        end: endTime,
      }),
    });

    if (
      isWithinInterval(newReservationStartTime, {
        start: startTime,
        end: endTime,
      }) ||
      isWithinInterval(newReservationEndTime, {
        start: startTime,
        end: endTime,
      })
    ) {
      isAvailable = false;
    }
  });

  return isAvailable;
};
