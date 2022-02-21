import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
} from 'firebase/auth';
import { auth } from 'firebase-config';
import { IUserCredentials, IPassword } from 'types';

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
