import { FC } from 'react';
import { useResolvedPath, useMatch, Link } from 'react-router-dom';
import { Button } from '@mui/material';

interface AuthLinkProps {
  name: string;
  label: string;
  to: string;
}

const AuthLink: FC<AuthLinkProps> = ({ name, label, to, ...rest }) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Button
      variant='text'
      sx={[
        {
          minWidth: 'unset',
          px: 0,
          py: 0,
          textTransform: 'none',
          letterSpacing: 0,
          fontSize: '1.5rem',
          color: !!match ? 'text.primary' : 'text.secondary',
          '&:not(:last-child)': {
            mr: 3,
          },
        },
        !!match && {
          '&:before': {
            content: '""',
            position: 'absolute',
            bottom: -6,
            left: 0,
            width: 40,
            height: 6,
            backgroundColor: 'primary.main',
          },
        },
      ]}
      key={name}
      component={Link}
      to={to}
      {...rest}
    >
      {label}
    </Button>
  );
};

export default AuthLink;
