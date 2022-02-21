import { User } from 'firebase/auth';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  credits: number;
}

export interface IExtendedUser extends User {
  userDetails: IUser;
}
