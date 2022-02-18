import { Helmet } from 'react-helmet-async';
import { Button, Box, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { ImageBrokenVariant as ImageBrokenVariantIcon } from 'mdi-material-ui';

const NotFound = () => (
  <>
    <Helmet title='Page Not Found' />
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <ImageBrokenVariantIcon
          style={{
            fontSize: '4rem',
            marginBottom: '0.5rem',
            opacity: 0.5,
          }}
        />
        <Typography variant='h2' component='h1'>
          Page not found
        </Typography>
        <Typography sx={{ mb: 2 }}>
          The page you requested does not exist.
        </Typography>
        <Button component={Link} to='/' sx={{ mx: 'auto' }}>
          Go home
        </Button>
      </Paper>
    </Box>
  </>
);

export default NotFound;
