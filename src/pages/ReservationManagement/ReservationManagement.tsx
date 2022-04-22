import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Paper, Typography, Grid, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridValueFormatterParams,
  GridSortModel,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { AdminWrapper, LoadingIndicator, ErrorAlert } from 'components';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { reservationsService, usersService } from 'services';
import {
  IReservation,
  IPopulatedReservation,
  IUpdateReservationParams,
} from 'types';
import { format, isWithinInterval, add, sub, isValid } from 'date-fns';
import { Close as CloseIcon, Delete as DeleteIcon } from 'mdi-material-ui';
import { useSnackbar } from 'notistack';

const ReservationManagement = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const currentDateTime = new Date();

  const [startDate, setStartDate] = useState(
    sub(currentDateTime, { months: 1 })
  );
  const [endDate, setEndDate] = useState(currentDateTime);

  const handleDateChange = (name: string, newDate: Date | null) => {
    if (isValid(newDate)) {
      switch (name) {
        case 'startDate':
          setStartDate(newDate as Date);
          break;
        case 'endDate':
          setEndDate(newDate as Date);
          break;
        default:
          break;
      }
    }
  };

  const formattedStartDate = format(startDate, 'Pp');
  const formattedEndDate = format(endDate, 'Pp');

  const dateRangeKey = {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };

  const { mutateAsync: earlyEndReservationMutateAsync } = useMutation(
    reservationsService.updateReservation,
    {
      onSuccess: (data) => {
        queryClient.setQueryData<IReservation[]>(
          ['reservations', dateRangeKey],
          (prevData) =>
            prevData
              ? prevData.map((reservation) =>
                  reservation.id === data.id ? data : reservation
                )
              : []
        );
        enqueueSnackbar('Reservation status updated', {
          variant: 'success',
        });
      },
      onError: () => {
        enqueueSnackbar('Failed to update reservation status', {
          variant: 'error',
        });
      },
    }
  );

  const earlyEndReservation = async (params: IUpdateReservationParams) =>
    await earlyEndReservationMutateAsync({
      id: params.id,
      reservation: {
        ...params.reservation,
        earlyEnd: true,
      },
    });

  const { mutateAsync: deleteReservationMutateAsync } = useMutation(
    reservationsService.deleteReservation,
    {
      onSuccess: (deletedId) => {
        queryClient.setQueryData<IReservation[]>(
          ['reservations', dateRangeKey],
          (prevData) =>
            prevData
              ? prevData.filter((reservation) => reservation.id !== deletedId)
              : []
        );
        enqueueSnackbar('Reservation deleted', {
          variant: 'success',
        });
      },
      onError: () => {
        enqueueSnackbar('Failed to delete reservation', {
          variant: 'error',
        });
      },
    }
  );

  const deleteReservation = async (id: string) =>
    await deleteReservationMutateAsync(id);

  const reservationsQuery = useQuery(['reservations', dateRangeKey], () =>
    reservationsService.getReservationsByDateCreatedRange(startDate, endDate)
  );

  const reservations = reservationsQuery.data || [];

  const usersQuery = useQuery(
    ['usersWithReservations', dateRangeKey],
    () =>
      usersService.getUsersByIds(
        reservations.map((reservation) => reservation.reserver)
      ),
    {
      enabled: reservations.length > 0,
    }
  );

  const users = usersQuery.data || [];

  const populatedReservations: IPopulatedReservation[] = reservations.map(
    (reservation: IReservation) => ({
      ...reservation,
      reserverData: users.find((user) => user.id === reservation.reserver),
    })
  );

  const isLoading = reservationsQuery.isLoading || usersQuery.isLoading;
  const isError = reservationsQuery.isError || usersQuery.isError;

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date created',
      type: 'dateTime',
      width: 180,
      valueGetter: ({
        value,
      }: GridValueGetterParams<Date, IPopulatedReservation>) =>
        value ? format(value, 'PPp') : '',
    },
    {
      field: 'name',
      headerName: 'Reserver',
      width: 220,
      valueGetter: (
        params: GridValueGetterParams<string, IPopulatedReservation>
      ) =>
        params.row.reserverData
          ? `${params.row.reserverData?.firstName} ${params.row.reserverData?.lastName}`
          : '',
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 220,
      valueGetter: (
        params: GridValueGetterParams<string, IPopulatedReservation>
      ) => params.row.reserverData?.email || '',
    },
    {
      field: 'floor',
      headerName: 'Floor',
      width: 120,
    },
    {
      field: 'area',
      headerName: 'Area',
      width: 100,
    },
    {
      field: 'lotNumber',
      headerName: 'Lot',
      width: 100,
    },
    {
      field: 'dateTime',
      headerName: 'Reservation date',
      type: 'dateTime',
      width: 180,
      valueFormatter: (params: GridValueFormatterParams) =>
        format(params.value as Date, 'PPp'),
    },
    {
      field: 'duration',
      headerName: 'Duration (mins.)',
      type: 'number',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      valueGetter: (
        params: GridValueGetterParams<string, IPopulatedReservation>
      ) => {
        const isActive = isWithinInterval(currentDateTime, {
          start: params.row.dateTime,
          end: add(params.row.dateTime, { minutes: params.row.duration }),
        });

        const isEarlyEnd = params.row.earlyEnd;

        if (isActive && isEarlyEnd) {
          return 'Early end';
        } else if (isActive && !isEarlyEnd) {
          return 'Active';
        } else {
          return 'Finished';
        }
      },
    },
    {
      field: 'actions',
      type: 'actions',
      // @ts-ignore
      getActions: (params: GridRowParams<IPopulatedReservation>) => [
        <GridActionsCellItem
          icon={<CloseIcon />}
          onClick={() => {
            const { id, reserverData, ...reservation } = params.row;
            earlyEndReservation({
              id,
              reservation,
            });
          }}
          label='end early'
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          onClick={() => deleteReservation(params.row.id)}
          label='delete reservation'
        />,
      ],
    },
  ];

  const sortModel: GridSortModel = [
    {
      field: 'createdAt',
      sort: 'desc',
    },
  ];

  return (
    <AdminWrapper title='Reservation Management'>
      <Helmet title='Reservation Management' />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <DateTimePicker
            label='Creation Start Date'
            value={startDate}
            onChange={(newDate) => handleDateChange('startDate', newDate)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DateTimePicker
            label='Creation End Date'
            value={endDate}
            onChange={(newDate) => handleDateChange('endDate', newDate)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
      </Grid>
      {isLoading && <LoadingIndicator />}
      {isError && <ErrorAlert />}
      {!isLoading && !isError && (
        <>
          <Paper sx={{ p: 2 }}>
            <Typography variant='h3' component='h2' sx={{ mb: 2 }}>
              {format(startDate, 'PPp')} - {format(endDate, 'PPp')}
            </Typography>
            <DataGrid
              columns={columns}
              rows={populatedReservations}
              initialState={{
                sorting: {
                  sortModel,
                },
              }}
              autoHeight
              loading={isLoading}
            />
          </Paper>
        </>
      )}
    </AdminWrapper>
  );
};

export default ReservationManagement;
