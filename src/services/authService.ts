import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '~/firebase-config';
import { IUser, IUserCredentials, IPassword, IExtendedUser } from '~/types';

export const authService = {
  register: async ({
    email,
    password,
  }: IUserCredentials): Promise<IExtendedUser> => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, 'users', user.user.uid);
    const reqBody: Omit<IUser, 'id'> = {
      email,
      firstName: '',
      lastName: '',
      contactNumber: '',
      credits: 0,
      userType: 'user',
    };
    await setDoc(userDocRef, reqBody);
    const userDetails = {
      id: user.user.uid,
      ...reqBody,
    };
    return {
      ...user.user,
      userDetails,
    };
  },
  signIn: async ({
    email,
    password,
  }: IUserCredentials): Promise<IExtendedUser> => {
    const user = await signInWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, 'users', user.user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const userDetails = {
      id: user.user.uid,
      ...(userDocSnap.data() as Omit<IUser, 'id'>),
    };
    return {
      ...user.user,
      userDetails,
    };
  },
  signOut: async () => await signOut(auth),
  updateUser: async (user: any) => {
    const auth = getAuth();
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, user);
    } else {
      throw new Error('User not logged in. Please sign in first.');
    }
  },
  updatePassword: async ({ currentPassword, newPassword }: IPassword) => {
    const auth = getAuth();
    if (auth.currentUser) {
      try {
        await signInWithEmailAndPassword(
          auth,
          auth.currentUser.email || '',
          currentPassword
        );
      } catch (err: any) {
        switch (err.code) {
          case 'auth/wrong-password':
            throw new Error('Current password is incorrect.');
          case 'auth/too-many-requests':
            throw new Error(
              'Too many password guesses. Please try again later.'
            );
          default:
            console.error(err?.message || err);
            throw new Error('Something went wrong. Please try again.');
        }
      }

      await updatePassword(auth.currentUser, newPassword);
    } else {
      throw new Error('User not logged in. Please sign in first.');
    }
  },
};
