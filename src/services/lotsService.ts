import { db } from '~/firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ILot } from '~/types';

interface GetLotByDetailsParams {
  floor: string;
  area: string;
  lotNumber: number;
}

const lotsRef = collection(db, 'lots');

export const lotsService = {
  getLots: async (): Promise<ILot[]> => {
    const data = await getDocs(lotsRef);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ILot, 'id'>),
    }));
  },
  getLotByDetails: async ({
    floor,
    area,
    lotNumber,
  }: GetLotByDetailsParams): Promise<ILot> => {
    const q = query(
      lotsRef,
      where('floor', '==', floor),
      where('area', '==', area),
      where('lotNumber', '==', lotNumber)
    );
    const data = await getDocs(q);

    if (data.docs.length === 0) throw new Error('Lot not found');

    return {
      id: data.docs[0].data().id,
      ...(data.docs[0].data() as Omit<ILot, 'id'>),
    };
  },
};
