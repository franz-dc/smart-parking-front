import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
} from 'firebase/auth';
import { auth } from 'firebase-config';
import { IUserCredentials } from 'types';

export const authService = {
  register: async ({ email, password }: IUserCredentials) => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  },
  signIn: async ({ email, password }: IUserCredentials) => {
    const user = await signInWithEmailAndPassword(auth, email, password);
    return user;
  },
  signOut: async () => await signOut(auth),
  updateUser: async (user: any) => {
    const auth = getAuth();
    if (auth.currentUser) {
      const updatedUser = await updateProfile(auth.currentUser, user);
      return updatedUser;
    } else {
      throw new Error('User not logged in. Please sign in first.');
    }
  },
  updatePassword: async (password: string) => {
    const auth = getAuth();
    if (auth.currentUser) {
      const updatedUser = await updatePassword(auth.currentUser, password);
      return updatedUser;
    } else {
      throw new Error('User not logged in. Please sign in first.');
    }
  },
};
