import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Alert,
  AlertTitle,
  List,
  Paper,
  Button,
  Typography,
  Avatar,
  Grid,
} from '@mui/material';
import { ErrorAlert, LoadingIndicator, UserWrapper } from '~/components';
import { useUserContext } from '~/hooks';
import { reservationsService } from '~/services';
import { IReservation } from '~/types';
import { useQuery } from 'react-query';
import { format, compareDesc } from 'date-fns';

const Reservations = () => {
  const { user } = useUserContext();

  const { data, isError, isLoading } = useQuery<IReservation[]>(
    'reservations',
    () => reservationsService.getReservationsByUser(user?.uid || ''),
    {
      enabled: !!user,
    }
  );

  const reservations =
    data?.sort((a, b) => compareDesc(a.dateTime, b.dateTime)) || [];

  return (
    <>
      <Helmet title='Reservations' />
      <UserWrapper title='Reservations'>
        {isLoading && <LoadingIndicator />}
        {isError && <ErrorAlert />}
        {!isLoading && !isError && !!user && (
          <>
            {reservations.length === 0 ? (
              <Alert severity='info' sx={{ mb: 2 }}>
                <AlertTitle>No Reservations</AlertTitle>
                You have no reservations yet. Start by{' '}
                <Link to='/reserve'>creating one.</Link>
              </Alert>
            ) : (
              <List
                sx={{
                  width: '100%',
                  p: 0,
                }}
              >
                {reservations.map((reservation, index) => (
                  <Paper
                    component='li'
                    key={reservation.id}
                    sx={{
                      mb: 2,
                      p: 2,
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs='auto'>
                        <Avatar sx={{ backgroundColor: 'primary.main' }}>
                          {reservations.length - index}
                        </Avatar>
                      </Grid>
                      <Grid item xs>
                        <Typography variant='h2' sx={{ fontSize: '1.5rem' }}>
                          {format(reservation.dateTime, 'PPp')}
                        </Typography>
                        <Typography variant='h3' sx={{ mb: 2 }}>
                          {reservation.duration} mins.
                        </Typography>
                        <Typography color='text.secondary'>
                          Created at: {format(reservation.createdAt, 'PPp')}
                        </Typography>
                        <Typography color='text.secondary'>
                          Location: {reservation.floor}, {reservation.area}
                          {reservation.lotNumber}
                        </Typography>
                        <Typography color='text.secondary'>
                          Plate number: {reservation.plateNumber}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </List>
            )}
            <Button component={Link} to='/reserve' fullWidth sx={{ mb: 2 }}>
              Create Reservation
            </Button>
          </>
        )}
      </UserWrapper>
    </>
  );
};

export default Reservations;
