import { Dispatch, SetStateAction, createContext } from 'react';
import { IExtendedUser } from 'types';

export const UserContext = createContext<{
  user: IExtendedUser | null;
  setUser: Dispatch<SetStateAction<IExtendedUser | null>>;
}>({
  user: null,
  setUser: () => {},
});
