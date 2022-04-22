import { FC, ReactNode } from 'react';
import { BaseWrapper } from '~/components';

interface AdminWrapperProps {
  title: string;
  children?: ReactNode;
}

const pages = [
  {
    name: 'Dashboard',
    link: '/admin/dashboard',
  },
  {
    name: 'User Top-ups',
    link: '/admin/top-ups',
  },
  {
    name: 'Reservations',
    link: '/admin/reservations',
  },
];

const AdminWrapper: FC<AdminWrapperProps> = ({ title, children }) => (
  <BaseWrapper title={title} type='admin' pages={pages} children={children} />
);

export default AdminWrapper;
