import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseWrapper } from 'components';

interface UserWrapperProps {
  title: string;
  children?: ReactNode;
}

const pages = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Reservations',
    link: '/reservations',
  },
  {
    name: 'Reserve',
    link: '/reserve',
  },
  {
    name: 'Availability',
    link: '/availability',
  },
];

const UserWrapper: FC<UserWrapperProps> = ({ title, children }) => {
  const navigate = useNavigate();

  return (
    <BaseWrapper
      title={title}
      type='user'
      pages={pages}
      children={children}
      additionalSettings={[
        {
          name: 'Top-up Credits',
          onClick: () => navigate('/top-up'),
        },
      ]}
    />
  );
};

export default UserWrapper;
