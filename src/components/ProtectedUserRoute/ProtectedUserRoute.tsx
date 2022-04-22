import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '~/hooks';

const ProtectedUserRoute = () => {
  const { user } = useUserContext();
  const location = useLocation();

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedUserRoute;
