// import React from 'react'
import { UserWrapper } from 'components';
import { Helmet } from 'react-helmet-async';
import { Button, Typography, Box, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField, Select } from 'formik-mui';
import * as Yup from 'yup';
import { formatCurrency } from 'utils';

const FLOORS = ['1st floor', '2nd floor'];

const AREAS = ['A'];

const LOTS = [
  {
    id: '0',
    floor: '1st floor',
    area: 'A',
    lot: 1,
    availability: 'available',
    reserver: '',
  },
  {
    id: '1',
    floor: '1st floor',
    area: 'A',
    lot: 2,
    availability: 'available',
    reserver: '',
  },
  {
    id: '2',
    floor: '2nd floor',
    area: 'A',
    lot: 1,
    availability: 'available',
    reserver: '',
  },
  {
    id: '3',
    floor: '2nd floor',
    area: 'A',
    lot: 2,
    availability: 'available',
    reserver: '',
  },
];

const RESERVATION_FEE = 50;

const PARKING_RATE = 2;

const Reserve = () => {
  const validationSchema = Yup.object().shape({
    floor: Yup.string().oneOf(FLOORS).required('Required'),
    area: Yup.string().oneOf(AREAS).required('Required'),
    date: Yup.date().required('Required'),
    lot: Yup.string().required('Required'),
    duration: Yup.number().min(0).max(43200).required('Required'),
  });

  const handleSubmit = async () => {
    try {
      //
    } catch (err) {
      //
    }
  };

  return (
    <>
      <Helmet title='Reserve' />
      <UserWrapper title='Reserve'>
        <Formik
          initialValues={{
            floor: '',
            area: '',
            date: '',
            duration: 0,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <Field
                component={Select}
                id='floor'
                name='floor'
                labelId='floor-label'
                label='Floor'
              >
                {FLOORS.map((floor) => (
                  <MenuItem value={floor} key={floor}>
                    {floor}
                  </MenuItem>
                ))}
              </Field>
              <Field
                component={Select}
                id='area'
                name='area'
                labelId='area-label'
                label='Area'
              >
                {AREAS.map((area) => (
                  <MenuItem value={area} key={area}>
                    {area}
                  </MenuItem>
                ))}
              </Field>
              <Field
                component={Select}
                id='lot'
                name='lot'
                labelId='lot-label'
                label='Lot'
              >
                {LOTS.map((lot) => (
                  <MenuItem value={lot.id} key={lot.id}>
                    {[lot.floor, lot.area + lot.lot].join(', ')}
                  </MenuItem>
                ))}
              </Field>
              <Field component={TextField} label='Date and Time' name='date' />
              <Field
                component={TextField}
                type='number'
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: 43200,
                  },
                }}
                label='Duration (minutes)'
                name='duration'
              />
              <Typography
                variant='h3'
                component='p'
                sx={{ wordBreak: 'break-word' }}
              >
                Reservation Fee: {formatCurrency(RESERVATION_FEE)}
              </Typography>
              <Typography
                variant='h3'
                component='p'
                gutterBottom
                sx={{ wordBreak: 'break-word' }}
              >
                Parking Fee: {formatCurrency(values.duration * PARKING_RATE)}
              </Typography>
              <Typography
                variant='h2'
                component='p'
                sx={{ wordBreak: 'break-word' }}
                color='primary'
              >
                Total Amount:{' '}
                {formatCurrency(
                  RESERVATION_FEE + values.duration * PARKING_RATE
                )}
              </Typography>
              <Box display='flex' justifyContent='flex-end' marginTop={2}>
                <Button
                  fullWidth
                  size='large'
                  type='submit'
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </Box>
              <Box marginTop={4}>
                <Typography variant='h4'>Disclaimer:</Typography>
                <Typography>
                  Please be at the parking slot at least 1 hour after the
                  parking time has been started. Reservation will expire after
                  this has not been met. Exceeding the set duration after
                  parking will have a penalty fee added to your total amount.
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </UserWrapper>
    </>
  );
};

export default Reserve;
