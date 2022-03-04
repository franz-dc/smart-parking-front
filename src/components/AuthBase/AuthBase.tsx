import { FC, ReactNode } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import AuthLink from './AuthLink';

// assets
import bg from 'assets/images/home-bg.jpg';
import logo from 'assets/images/logo.png';

interface AuthBaseProps {
  children: ReactNode;
  type?: 'login' | 'register';
}

const authTypes = [
  {
    name: 'login',
    label: 'Sign in',
    to: '/login',
  },
  {
    name: 'register',
    label: 'Register',
    to: '/register',
  },
];

const AuthBase: FC<AuthBaseProps> = ({ children, type }) => (
  <Grid
    container
    sx={{
      height: '100vh',
      width: '100vw',
    }}
  >
    <Grid
      item
      xs={12}
      lg={7}
      sx={{
        height: '100vh',
        display: {
          xs: 'none',
          lg: 'block',
        },
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
      }}
    />
    <Grid item xs={12} lg={5}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: {
            xs: 3,
            lg: 6,
          },
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            mb: 'auto',
          }}
        >
          <Grid container spacing={1.5}>
            <Grid item xs='auto'>
              <Box
                component='img'
                src={logo}
                sx={{
                  width: 40,
                  height: 40,
                  padding: 0.5,
                  borderRadius: '50%',
                  backgroundColor: 'black',
                }}
              />
            </Grid>
            <Grid
              item
              xs='auto'
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant='h3' component='div'>
                Smart Parking
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            mb: '58px',
          }}
        >
          {type && (
            <Box
              sx={{
                mb: 8,
              }}
            >
              {authTypes.map((authType) => (
                <AuthLink
                  key={authType.name}
                  name={authType.name}
                  label={authType.label}
                  to={authType.to}
                />
              ))}
            </Box>
          )}
          {children}
        </Box>
        <Box
          sx={{
            mt: 'auto',
          }}
        />
      </Box>
    </Grid>
  </Grid>
);

export default AuthBase;
