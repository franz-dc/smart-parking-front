import { db } from 'firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { ILot } from 'types';

const lotsRef = collection(db, 'lots');

export const lotsService = {
  getLots: async (): Promise<ILot[]> => {
    const data = await getDocs(lotsRef);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ILot, 'id'>),
    }));
  },
};
