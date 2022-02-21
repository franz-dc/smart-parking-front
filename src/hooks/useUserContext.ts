import { useContext } from 'react';
import { UserContext } from 'contexts';

export const useUserContext = () => useContext(UserContext);
