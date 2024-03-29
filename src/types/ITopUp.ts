import { IUser } from 'types';

export interface ITopUp {
  id: string;
  amount: number;
  createdAt: Date;
  platform: string;
  referenceNumber: string;
  status: 'pending' | 'credited' | 'rejected';
  userId: string;
  // for rendering only
  userDetails?: IUser;
}

export interface IUpdateTopUpParams {
  id: string;
  topUp: Omit<ITopUp, 'id'>;
}

export interface IUpdateTopUpParamsWithStatus extends IUpdateTopUpParams {
  status: ITopUp['status'];
}
