import { db } from 'firebase-config';
import {
  collection,
  getDocs,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { IReservation } from 'types';

const reservationsRef = collection(db, 'reservations');

const queryFromReservationDate = (dateTime: Date) =>
  query(reservationsRef, where('dateTime', '>', dateTime));

const queryFromDateCreated = (createdAt: Date) =>
  query(reservationsRef, where('createdAt', '>', createdAt));

const queryByUserId = (userId: string) =>
  query(reservationsRef, where('reserver', '==', userId));

const mappedData = (data: QuerySnapshot<DocumentData>) =>
  data.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<IReservation, 'id'>),
    dateTime: doc.data().dateTime.toDate() as Date,
    createdAt: doc.data().createdAt.toDate() as Date,
  }));

export const reservationsService = {
  getReservations: async (): Promise<IReservation[]> => {
    const data = await getDocs(reservationsRef);
    return mappedData(data);
  },
  getReservationsByUser: async (userId: string): Promise<IReservation[]> => {
    const data = await getDocs(queryByUserId(userId));
    return mappedData(data);
  },
  getReservationsFromReservationDate: async (
    dateTime: Date
  ): Promise<IReservation[]> => {
    const data = await getDocs(queryFromReservationDate(dateTime));
    return mappedData(data);
  },
  getReservationsFromDateCreated: async (
    createdAt: Date
  ): Promise<IReservation[]> => {
    const data = await getDocs(queryFromDateCreated(createdAt));
    return mappedData(data);
  },
};
