import { db } from 'firebase-config';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  writeBatch,
  query,
  where,
  QuerySnapshot,
  DocumentData,
  increment,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { usersService } from 'services';
import {
  ITopUp,
  IUpdateTopUpParams,
  IUpdateTopUpParamsWithStatus,
} from 'types';

const topUpsRef = collection(db, 'topUps');

const mapData = (data: QuerySnapshot<DocumentData>) =>
  data.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ITopUp, 'id'>),
    createdAt: doc.data().createdAt.toDate() as Date,
  }));

export const topUpsService = {
  getTopUps: async (): Promise<ITopUp[]> => {
    const data = await getDocs(topUpsRef);
    return mapData(data);
  },
  getTopUpsByStatus: async (status: string): Promise<ITopUp[]> => {
    const q = query(topUpsRef, where('status', '==', status));
    const data = await getDocs(q);
    return mapData(data);
  },
  getTopUpsByUser: async (userId: string): Promise<ITopUp[]> => {
    const q = query(topUpsRef, where('userId', '==', userId));
    const data = await getDocs(q);
    return mapData(data);
  },
  addTopUp: async (topUp: Omit<ITopUp, 'id'>): Promise<ITopUp> => {
    const doc = await addDoc(topUpsRef, topUp);
    return {
      id: doc.id,
      ...topUp,
      createdAt: new Date(),
    };
  },
  updateTopUp: async ({
    id,
    topUp,
    status,
  }: IUpdateTopUpParamsWithStatus): Promise<ITopUp> => {
    const docRef = doc(db, 'topUps', id);
    await updateDoc(docRef, topUp);

    return {
      id,
      ...topUp,
      status,
    };
  },
  approveTopUp: async ({ id, topUp }: IUpdateTopUpParams): Promise<ITopUp> => {
    const auth = getAuth();

    if (!auth.currentUser) throw new Error('User not logged in');

    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const topUpDocRef = doc(db, 'topUps', id);
    const userDetails = await usersService.getUserById(auth.currentUser.uid);
    const batch = writeBatch(db);

    batch.update(topUpDocRef, { status: 'credited' });

    if (userDetails) {
      batch.update(userDocRef, { credits: increment(topUp.amount) });
    } else {
      batch.set(userDocRef, {
        contactNumber: '',
        credits: topUp.amount,
        email: auth.currentUser.email || '',
        firstName: '',
        lastName: '',
      });
    }

    await batch.commit();

    return {
      id,
      ...topUp,
      status: 'credited',
    };
  },
};
