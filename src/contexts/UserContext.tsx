import {
  FC,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useEffect,
} from 'react';
import { IExtendedUser } from 'types';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { usersService } from 'services';

export const UserContext = createContext<{
  user: IExtendedUser | null;
  setUser: Dispatch<SetStateAction<IExtendedUser | null>>;
}>({
  user: null,
  setUser: () => {},
});

export const UserContextProvider: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [baseUser, setBaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<IExtendedUser | null>(null);

  const [isBaseUserLoading, setIsBaseUserLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      (user) => {
        setBaseUser(user);
        setIsBaseUserLoading(false);
      },
      (error) => {
        setIsLoading(false);
        console.error(error);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!isBaseUserLoading && !baseUser) {
        setIsLoading(false);
      }

      if (baseUser) {
        const userData = await usersService.getUserById(baseUser.uid);

        setUser({
          ...baseUser,
          userDetails: userData || {
            id: baseUser.uid || '',
            firstName: '',
            lastName: '',
            email: '',
            contactNumber: '',
            credits: 0,
          },
        });

        setIsLoading(false);
      }
    };

    fetchData();
  }, [isBaseUserLoading, baseUser]);

  if (isLoading) {
    return <></>;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
