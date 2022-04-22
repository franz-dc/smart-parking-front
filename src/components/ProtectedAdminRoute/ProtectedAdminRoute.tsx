import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '~/hooks';
import { NotFound } from '~/pages';

const ProtectedUserRoute = () => {
  const { user } = useUserContext();
  const location = useLocation();

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (user.userDetails.userType !== 'admin') {
    return <NotFound />;
  }

  return <Outlet />;
};

export default ProtectedUserRoute;
