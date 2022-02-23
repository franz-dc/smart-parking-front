import { db } from 'firebase-config';
import {
  doc,
  collection,
  getDocs,
  query,
  where,
  QuerySnapshot,
  DocumentData,
  writeBatch,
  increment,
} from 'firebase/firestore';
import { IReservation, IRates } from 'types';
import { usersService } from 'services';
import { getReservationAmount, isLotAvailable } from 'utils';

const reservationsRef = collection(db, 'reservations');

const mapData = (data: QuerySnapshot<DocumentData>) =>
  data.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<IReservation, 'id'>),
    dateTime: doc.data().dateTime.toDate() as Date,
    createdAt: doc.data().createdAt.toDate() as Date,
  }));

export const reservationsService = {
  getReservations: async (): Promise<IReservation[]> => {
    const data = await getDocs(reservationsRef);
    return mapData(data);
  },
  getReservationsByUser: async (userId: string): Promise<IReservation[]> => {
    const q = query(reservationsRef, where('reserver', '==', userId));
    const data = await getDocs(q);
    return mapData(data);
  },
  getReservationsFromReservationDate: async (
    dateTime: Date
  ): Promise<IReservation[]> => {
    const q = query(reservationsRef, where('dateTime', '>=', dateTime));
    const data = await getDocs(q);
    return mapData(data);
  },
  getReservationsFromDateCreated: async (
    createdAt: Date
  ): Promise<IReservation[]> => {
    const q = query(reservationsRef, where('createdAt', '>=', createdAt));
    const data = await getDocs(q);
    return mapData(data);
  },
  addReservation: async (
    reservation: Omit<IReservation, 'id'>,
    rates: IRates
  ): Promise<IReservation> => {
    // check if the lot is available
    const q = query(
      reservationsRef,
      where('dateTime', '<=', reservation.dateTime),
      where('floor', '==', reservation.floor),
      where('area', '==', reservation.area),
      where('lotNumber', '==', reservation.lotNumber)
    );
    const lotReservationsData = await getDocs(q);
    const lotReservations = mapData(lotReservationsData);
    const isLotCurrentlyAvailable = isLotAvailable(
      lotReservations,
      reservation
    );

    if (!isLotCurrentlyAvailable) throw new Error('LOT_UNAVAILABLE');

    // get the user's data and check if the user has enough balance
    const userDetails = await usersService.getUserById(reservation.reserver);
    const userDocRef = doc(db, 'users', reservation.reserver);
    const totalAmount = getReservationAmount(reservation, rates);

    if (!userDetails || userDetails.credits < totalAmount)
      throw new Error('INSUFFICIENT_CREDITS');

    // create the reservation if all the checks pass
    // and update the user's credits
    const reservationDocRef = doc(reservationsRef);
    const batch = writeBatch(db);

    batch.update(userDocRef, {
      credits: increment(-totalAmount),
    });

    batch.set(reservationDocRef, reservation);

    await batch.commit();

    return {
      id: reservationDocRef.id,
      ...reservation,
    };
  },
};
