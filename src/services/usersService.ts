import { db } from 'firebase-config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
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
  getUserById: async (userId: string): Promise<IUser> => {
    const docRef = doc(db, 'users', userId);
    const data = await getDoc(docRef);
    return data.data() as IUser;
  },
  updateUser: async (user: any) => {
    const auth = getAuth();
    if (auth.currentUser) {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const updatedUser = await updateDoc(docRef, user);
        return updatedUser;
      } else {
        const updatedUser = await setDoc(docRef, {
          ...user,
          id: auth.currentUser.uid,
          email: auth.currentUser.email,
          credits: 0,
        });
        return updatedUser;
      }
    }
  },
};
