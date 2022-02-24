import { db } from 'firebase-config';
import {
  collection,
  doc,
  query,
  where,
  documentId,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { IUser } from 'types';

const usersRef = collection(db, 'users');

const mapData = (data: QuerySnapshot<DocumentData>) =>
  data.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<IUser, 'id'>),
  }));

export const usersService = {
  getUsers: async (): Promise<IUser[]> => {
    const data = await getDocs(usersRef);
    return mapData(data);
  },
  getUserById: async (userId: string): Promise<IUser> => {
    const docRef = doc(db, 'users', userId);
    const data = await getDoc(docRef);
    return data.data() as IUser;
  },
  getUsersByIds: async (userIds: string[]): Promise<IUser[]> => {
    const q = query(usersRef, where(documentId(), 'in', userIds));
    const data = await getDocs(q);
    return mapData(data);
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
          email: auth.currentUser.email,
          credits: 0,
        });
        return updatedUser;
      }
    }
  },
};
