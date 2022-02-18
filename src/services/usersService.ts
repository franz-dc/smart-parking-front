import { db } from 'firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { IUser } from 'types';

const usersRef = collection(db, 'users');

export const usersService = {
  getUsers: async (): Promise<IUser[]> => {
    const data = await getDocs(usersRef);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<IUser, 'id'>),
    }));
  },
};
