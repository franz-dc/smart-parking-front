import { db } from 'firebase-config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { IRates } from 'types';
import { DEFAULT_RATES } from 'utils/constants';

const ratesRef = collection(db, 'rates');

export const ratesService = {
  getRates: async (): Promise<IRates[]> => {
    const data = await getDocs(ratesRef);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<IRates, 'id'>),
    }));
  },
  getLatestRates: async (): Promise<IRates> => {
    const q = query(ratesRef, orderBy('createdAt', 'desc'), limit(1));
    const data = await getDocs(q);

    if (data.docs.length === 0) {
      return DEFAULT_RATES;
    }

    return {
      id: data.docs[0].id,
      ...(data.docs[0].data() as Omit<IRates, 'id'>),
    };
  },
};
