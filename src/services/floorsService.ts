import { db } from '~/firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { IFloor } from '~/types';

const floorsRef = collection(db, 'floors');

export const floorsService = {
  getFloors: async (): Promise<IFloor[]> => {
    const data = await getDocs(floorsRef);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<IFloor, 'id'>),
    }));
  },
};
