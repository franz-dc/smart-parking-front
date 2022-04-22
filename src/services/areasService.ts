import { db } from '~/firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { IArea } from '~/types';

const areasRef = collection(db, 'areas');

export const areasService = {
  getAreas: async (): Promise<IArea[]> => {
    const data = await getDocs(areasRef);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<IArea, 'id'>),
    }));
  },
};
