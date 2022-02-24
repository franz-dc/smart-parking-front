import { ChangeEvent, useMemo } from 'react';
import { UserWrapper, LoadingIndicator, ErrorAlert } from 'components';
import { Helmet } from 'react-helmet-async';
import { Typography, Box, MenuItem, Paper } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Formik, Form, Field } from 'formik';
import { TextField, Select } from 'formik-mui';
import { DateTimePicker } from 'formik-mui-lab';
import * as Yup from 'yup';
import { formatCurrency, getReservationAmount } from 'utils';
import {
  floorsService,
  areasService,
  lotsService,
  ratesService,
  reservationsService,
} from 'services';
import { useQueries } from 'react-query';
import { useSnackbar } from 'notistack';
import { useUserContext } from 'hooks';
import { DEFAULT_RATES, MAX_DURATION } from 'utils/constants';
import { serverTimestamp } from 'firebase/firestore';

const Reserve = () => {
  const { user, setUser } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();

  const queries = useQueries([
    {
      queryKey: 'floors',
      queryFn: floorsService.getFloors,
    },
    {
      queryKey: 'areas',
      queryFn: areasService.getAreas,
    },
    {
      queryKey: 'lots',
      queryFn: lotsService.getLots,
    },
    {
      queryKey: 'latestRates',
      queryFn: ratesService.getLatestRates,
    },
  ]);

  const floorsData = queries[0].data;
  const areasData = queries[1].data;
  const lotsData = queries[2].data;
  const ratesData = queries[3].data;

  const floors = useMemo(() => floorsData || [], [floorsData]);
  const areas = useMemo(() => areasData || [], [areasData]);
  const lots = lotsData || [];
  const rates = ratesData || DEFAULT_RATES;

  const isLoading = queries.some(({ isLoading }) => isLoading);
  const isError = queries.some(({ isError }) => isError);

  const validationSchema = Yup.object()
    .shape({
      floor: Yup.string()
        .oneOf(
          floors.map((floor) => floor.name),
          'Invalid floor'
        )
        .required('Required'),
      area: Yup.string()
        .oneOf(
          areas.map((area) => area.name),
          'Invalid area'
        )
        .required('Required'),
      lotNumber: Yup.string()
        .oneOf(
          [...lots.map((lot) => lot.lotNumber.toString()), ''],
          'Invalid lot number'
        )
        .required('Required'),
      dateTime: Yup.date().required('Required'),
      duration: Yup.number().min(1).max(MAX_DURATION).required('Required'),
      plateNumber: Yup.string().required('Required'),
    })
    .required();

  const handleSubmit = async (
    values: Yup.InferType<typeof validationSchema>
  ) => {
    try {
      if (user) {
        const reqBody = {
          ...values,
          lotNumber: parseInt(values.lotNumber),
          reserver: user.uid,
          createdAt: serverTimestamp(),
          earlyEnd: false,
        };

        const reservationAmount = getReservationAmount(reqBody, rates);
        await reservationsService.addReservation(reqBody, rates);
        setUser({
          ...user,
          userDetails: {
            ...user.userDetails,
            credits: user.userDetails.credits - reservationAmount,
          },
        });
        enqueueSnackbar('Reservation successful', { variant: 'success' });
      } else {
        enqueueSnackbar('You must be logged in to reserve a lot', {
          variant: 'error',
        });
      }
    } catch (err: any) {
      console.error(err);
      let message = 'Error reserving lot';

      switch (err?.message) {
        case 'INSUFFICIENT_CREDITS':
          message = 'Insufficient credits';
          break;
        case 'LOT_UNAVAILABLE':
          message = 'Lot is currently unavailable (occupied or reserved)';
          break;
        default:
          break;
      }

      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  return (
    <>
      <Helmet title='Reserve' />
      <UserWrapper title='Reserve'>
        {isLoading && <LoadingIndicator />}
        {isError && <ErrorAlert />}
        {!isLoading && !isError && (
          <Formik
            enableReinitialize
            initialValues={{
              floor: '',
              area: '',
              lotNumber: '',
              dateTime: new Date(),
              duration: 0,
              plateNumber: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setValues, isSubmitting }) => (
              <Form>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Field
                    component={Select}
                    id='floor'
                    name='floor'
                    label='Floor'
                    onChange={(e: ChangeEvent<any>) => {
                      setValues(
                        {
                          ...values,
                          floor: e.target.value,
                          area: '',
                          lotNumber: '',
                        },
                        false
                      );
                    }}
                  >
                    <MenuItem value='' disabled>
                      Select an option
                    </MenuItem>
                    {floors.map((floor) => (
                      <MenuItem value={floor.name} key={floor.name}>
                        {floor.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <Field
                    component={Select}
                    id='area'
                    name='area'
                    label='Area'
                    onChange={(e: ChangeEvent<any>) => {
                      setValues(
                        {
                          ...values,
                          area: e.target.value,
                          lotNumber: '',
                        },
                        false
                      );
                    }}
                  >
                    <MenuItem value='' disabled>
                      Select an option
                    </MenuItem>
                    {areas
                      .filter((area) => area.floor === values.floor)
                      .map((area) => (
                        <MenuItem value={area.name} key={area.name}>
                          {area.name}
                        </MenuItem>
                      ))}
                  </Field>
                  <Field
                    component={Select}
                    id='lotNumber'
                    name='lotNumber'
                    label='Lot'
                  >
                    <MenuItem value='' disabled>
                      Select an option
                    </MenuItem>
                    {lots
                      .filter(
                        (lot) =>
                          lot.floor === values.floor && lot.area === values.area
                      )
                      .map((lot) => (
                        <MenuItem
                          value={lot.lotNumber.toString()}
                          key={lot.lotNumber}
                        >
                          {[lot.floor, lot.area + lot.lotNumber].join(', ')}
                        </MenuItem>
                      ))}
                  </Field>
                  <Field
                    component={DateTimePicker}
                    label='Date and Time'
                    name='dateTime'
                  />
                  <Field
                    component={TextField}
                    type='number'
                    InputProps={{
                      inputProps: {
                        min: 1,
                        max: MAX_DURATION,
                      },
                    }}
                    label='Duration (minutes)'
                    name='duration'
                  />
                  <Field
                    component={TextField}
                    label='Plate Number'
                    name='plateNumber'
                    margin='none'
                  />
                </Paper>
                <Typography
                  variant='h3'
                  component='p'
                  sx={{ wordBreak: 'break-word' }}
                >
                  Reservation Fee: {formatCurrency(rates.reservationFee)}
                </Typography>
                <Typography
                  variant='h3'
                  component='p'
                  gutterBottom
                  sx={{ wordBreak: 'break-word' }}
                >
                  Parking Fee:{' '}
                  {formatCurrency(values.duration * rates.parkingRate)}
                </Typography>
                <Typography
                  variant='h2'
                  component='p'
                  sx={{ wordBreak: 'break-word' }}
                  color='primary'
                >
                  Total Amount:{' '}
                  {formatCurrency(
                    rates.reservationFee + values.duration * rates.parkingRate
                  )}
                </Typography>
                <Box display='flex' justifyContent='flex-end' marginTop={2}>
                  <LoadingButton
                    fullWidth
                    size='large'
                    type='submit'
                    loading={isSubmitting}
                  >
                    Reserve
                  </LoadingButton>
                </Box>
                <Box marginTop={4}>
                  <Typography variant='h4'>Disclaimer:</Typography>
                  <Typography component='ul'>
                    {/* <li>
                      Please be at the parking slot at least 1 hour after the
                      parking time has been started. Reservation will expire
                      after this has not been met.
                    </li> */}
                    <li>
                      Exceeding the set duration after parking will have a
                      penalty fee added to your total amount.
                    </li>
                    <li>
                      Credits are non-refundable if the reservation is cancelled
                      or if there is remaining time after using the parking lot.
                    </li>
                  </Typography>
                </Box>
              </Form>
            )}
          </Formik>
        )}
      </UserWrapper>
    </>
  );
};

export default Reserve;
