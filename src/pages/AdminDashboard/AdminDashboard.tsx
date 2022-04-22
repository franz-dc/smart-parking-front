import { Helmet } from 'react-helmet-async';
import { Paper, Grid, Box, Typography } from '@mui/material';
import { pink, brown, green, blue } from '@mui/material/colors';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridValueFormatterParams,
  GridSortModel,
} from '@mui/x-data-grid';
import { AdminWrapper, LoadingIndicator, ErrorAlert } from 'components';
import { useQueries } from 'react-query';
import { usersService, lotsService, reservationsService } from 'services';
import { sub, formatDistanceToNowStrict, format, isSameDay } from 'date-fns';
import {
  Account as AccountIcon,
  Parking as ParkingIcon,
  Cards as CardsIcon,
  CardBulleted as CardBulletedIcon,
} from 'mdi-material-ui';
import { getAvailabilityColor, isLotAvailable } from 'utils';
import { DATE_RANGE_START } from 'utils/constants';
import { IReservation, IPopulatedReservation } from 'types';

// charts
import EChartsReact from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from 'echarts/components';

echarts.use([TitleComponent, TooltipComponent, GridComponent, LineChart]);

const AdminDashboard = () => {
  const currentDate = new Date();
  const newDateFromNow = sub(currentDate, DATE_RANGE_START);
  const dateRangeStartInWords = formatDistanceToNowStrict(newDateFromNow);

  const queries = useQueries([
    {
      queryKey: 'users',
      queryFn: usersService.getUsers,
    },
    {
      queryKey: 'lots',
      queryFn: lotsService.getLots,
    },
    {
      queryKey: 'reservations',
      queryFn: () =>
        reservationsService.getReservationsFromReservationDate(newDateFromNow),
    },
  ]);

  const isLoading = queries.some(({ isLoading }) => isLoading);
  const isError = queries.some(({ isError }) => isError);

  const usersData = queries[0].data;
  const lotsData = queries[1].data;
  const reservationsData = queries[2].data;

  const users = usersData || [];
  const lots = lotsData || [];
  const reservations = reservationsData || [];

  const populatedReservations: IPopulatedReservation[] = reservations.map(
    (reservation: IReservation) => ({
      ...reservation,
      reserverData: users.find((user) => user.id === reservation.reserver),
    })
  );

  const userCount = users.length;
  const lotCount = lots.length;
  const reservationCount = reservations.length;

  const occupiedLots = lots.reduce(
    (acc, lot) => Number(!lot.available) + acc,
    0
  );

  const reservedLots = lots.reduce((acc, lot) => {
    const isLotReserved = !isLotAvailable(
      reservations.filter(
        (reservation) =>
          reservation.lotNumber === lot?.lotNumber &&
          reservation.area === lot?.area &&
          reservation.floor === lot?.floor &&
          !reservation.earlyEnd
      ),
      {
        dateTime: currentDate,
        duration: 0,
        floor: lot.floor,
        area: lot.area,
        lotNumber: lot.lotNumber,
        reserver: '',
        plateNumber: '',
        earlyEnd: false,
        createdAt: currentDate,
      }
    );

    return isLotReserved ? acc + Number(lot.available) : acc;
  }, 0);

  const availableLots = lotCount - occupiedLots - reservedLots;

  // const availableLots =
  //   lots.reduce((acc, lot) => Number(lot.available) + acc, 0) - reservedLots;

  // const occupiedLots = lotCount - availableLots;

  const overviewItems = [
    {
      label: 'Users',
      value: userCount,
      icon: AccountIcon,
      color: pink[500],
    },
    {
      label: 'Lots',
      value: lotCount,
      icon: ParkingIcon,
      color: brown[500],
    },
    {
      label: 'Available',
      value: availableLots,
      icon: CardsIcon,
      color: green[500],
    },
    {
      label: `Reservations (last ${dateRangeStartInWords})`,
      value: reservationCount,
      icon: CardBulletedIcon,
      color: blue[500],
    },
  ];

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
      field: 'contactNumber',
      headerName: 'Contact number',
      width: 220,
      valueGetter: (
        params: GridValueGetterParams<string, IPopulatedReservation>
      ) => params.row.reserverData?.contactNumber || '',
    },
    {
      field: 'floor',
      headerName: 'Floor',
      width: 150,
    },
    {
      field: 'area',
      headerName: 'Area',
      width: 120,
    },
    {
      field: 'lotNumber',
      headerName: 'Lot',
      width: 120,
    },
    {
      field: 'dateTime',
      headerName: 'Reservation date',
      type: 'dateTime',
      width: 180,
      valueFormatter: (params: GridValueFormatterParams) =>
        format(params.value as Date, 'PPp'),
    },
  ];

  const sortModel: GridSortModel = [
    {
      field: 'createdAt',
      sort: 'desc',
    },
  ];

  return (
    <>
      <Helmet title='Dashboard' />
      <AdminWrapper title='Dashboard'>
        {isLoading && <LoadingIndicator />}
        {isError && <ErrorAlert />}
        {!isLoading && !isError && (
          <>
            <Grid
              container
              spacing={2}
              sx={{
                mb: 2,
              }}
            >
              {overviewItems.map((item) => (
                <Grid item xs={12} sm={6} lg={3} key={item.label}>
                  <Paper
                    sx={{
                      p: 2,
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs>
                        <Typography>{item.label}</Typography>
                        <Typography variant='h3' component='p'>
                          {item.value}
                        </Typography>
                      </Grid>
                      <Grid item xs='auto'>
                        <Box
                          sx={{
                            backgroundColor: item.color,
                            borderRadius: '50%',
                            width: 45,
                            height: 45,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <item.icon
                            sx={{ color: 'white', fontSize: '1.75rem' }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                mb: 2,
              }}
            >
              <Grid item xs={12} lg={4}>
                <Paper sx={{ p: 2 }}>
                  <EChartsReact
                    option={{
                      title: {
                        text: `Current Lot Status`,
                      },
                      tooltip: {
                        trigger: 'item',
                      },
                      legend: {
                        orient: 'vertical',
                        x: 'left',
                        top: 40,
                        data: ['Available', 'Occupied', 'Reserved'],
                      },
                      series: {
                        type: 'pie',
                        top: 10,
                        left: 75,
                        radius: ['50%', '80%'],
                        avoidLabelOverlap: false,
                        label: {
                          show: false,
                        },
                        labelLine: {
                          show: false,
                        },
                        emphasis: {
                          label: {
                            show: false,
                          },
                        },
                        data: [
                          {
                            name: 'Available',
                            value: availableLots,
                            itemStyle: {
                              color: getAvailabilityColor('available'),
                            },
                          },
                          {
                            name: 'Occupied',
                            value: occupiedLots,
                            itemStyle: {
                              color: getAvailabilityColor('occupied'),
                            },
                          },
                          {
                            name: 'Reserved',
                            value: reservedLots,
                            itemStyle: {
                              color: getAvailabilityColor('reserved'),
                            },
                          },
                        ],
                      },
                    }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Paper sx={{ p: 2 }}>
                  <EChartsReact
                    option={{
                      title: {
                        text: `Reservations (last ${dateRangeStartInWords})`,
                      },
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'cross',
                        },
                      },
                      grid: {
                        left: 40,
                        right: 40,
                        bottom: 0,
                        containLabel: true,
                      },
                      xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: Array(DATE_RANGE_START.days)
                          .fill(null)
                          .map((_, i) => {
                            const date = sub(currentDate, { days: i });
                            return format(date, 'PP');
                          })
                          .reverse(),
                      },
                      yAxis: {
                        type: 'value',
                        min: 0,
                        minInterval: 1,
                      },
                      series: {
                        name: 'Reservations',
                        type: 'line',
                        areaStyle: {
                          opacity: 0.35,
                        },
                        smooth: true,
                        data: Array(DATE_RANGE_START.days)
                          .fill(null)
                          .map((_, i) =>
                            reservations.reduce(
                              (acc, reservation) =>
                                isSameDay(
                                  reservation.dateTime,
                                  sub(currentDate, { days: i })
                                )
                                  ? acc + 1
                                  : acc,
                              0
                            )
                          )
                          .reverse(),
                      },
                    }}
                  />
                </Paper>
              </Grid>
            </Grid>
            <Paper sx={{ p: 2 }}>
              <Typography variant='h3' component='h2' sx={{ mb: 2 }}>
                Reservation list (last {dateRangeStartInWords})
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
    </>
  );
};

export default AdminDashboard;
