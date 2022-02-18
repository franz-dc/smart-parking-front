import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

// assets
import bg from 'assets/images/home-bg.jpg';
import logo from 'assets/images/logo.png';

const Home = () => {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          zIndex: -1,
        }}
      />
      <Grid container sx={{ height: '100vh' }}>
        <Grid
          item
          xs={12}
          md={5}
          lg={4}
          sx={{
            position: 'relative',
            backgroundColor: alpha(grey[800], 0.8),
            height: '100vh',
            maxWidth: {
              lg: '900px !important',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 40,
              left: {
                xs: 40,
                md: '20%',
              },
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs='auto'>
                <Box
                  component='img'
                  src={logo}
                  sx={{
                    width: 40,
                    height: 40,
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
                <Typography
                  variant='h3'
                  component='div'
                  sx={{ color: 'white' }}
                >
                  Brand
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: {
                xs: '50%',
                md: '20%',
              },
              transform: {
                xs: 'translate(-50%, -50%)',
                md: 'translateY(-50%)',
              },
              width: {
                xs: '85%',
                md: '110%',
              },
              textAlign: {
                xs: 'center',
                md: 'left',
              },
            }}
          >
            <Typography
              variant='h1'
              sx={{
                color: 'white',
                textTransform: 'uppercase',
                fontSize: {
                  xs: '4rem',
                  md: '5rem',
                  lg: '5.5rem',
                  xl: '6.5rem',
                },
                marginBottom: 4,
              }}
            >
              The future of parking starts here
            </Typography>
            <Button
              component={Link}
              to='/register'
              sx={{
                backgroundColor: 'white',
                color: 'black',
                borderRadius: 9999,
                fontSize: '1.5rem',
                px: 3,
                textTransform: 'none',
                letterSpacing: 0,
                '&:hover': {
                  backgroundColor: grey[300],
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
