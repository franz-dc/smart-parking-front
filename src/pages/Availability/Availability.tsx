import { useState, useEffect, useMemo } from 'react';
import { UserWrapper } from 'components';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Grid,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Alert,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { Circle as CircleIcon } from 'mdi-material-ui';
import { LoadingIndicator, ErrorAlert } from 'components';
import {
  capitalize,
  getLotFromCoords,
  getAvailabilityColor,
  isLotAvailable,
} from 'utils';
import {
  areasService,
  floorsService,
  lotsService,
  reservationsService,
} from 'services';
import { useQueries } from 'react-query';
import { IArea, IFloor } from 'types';
import { format, sub } from 'date-fns';
import { MAX_DURATION_MINUTES } from 'utils/constants';

// ! ADD ENTRANCES
// ! DECIDE ON A WAY TO STRUCTURE THIS ON THE AREAS DOCUMENT

const STATUSES = ['available', 'reserved', 'occupied', 'not available'];

const Availability = () => {
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
    // subtract MAX_DURATION_MINUTES from today since those are still active
    {
      queryKey: [
        'reservationsFromReservationDate',
        format(sub(new Date(), { minutes: MAX_DURATION_MINUTES }), 'Pp'),
      ],
      queryFn: () =>
        reservationsService.getReservationsFromReservationDate(
          sub(new Date(), { minutes: MAX_DURATION_MINUTES })
        ),
    },
  ]);

  const floorsData = queries[0].data;
  const areasData = queries[1].data;
  const lotsData = queries[2].data;
  const reservationsData = queries[3].data;

  const floors = useMemo(() => floorsData || [], [floorsData]);
  const areas = useMemo(() => areasData || [], [areasData]);
  const lots = lotsData || [];
  const reservations = reservationsData || [];

  const isLoading = queries.some(({ isLoading }) => isLoading);
  const isError = queries.some(({ isError }) => isError);

  const [selectedArea, setSelectedArea] = useState<IArea | null>(null);

  const [selectedFloor, setSelectedFloor] = useState<IFloor | null>(null);

  const handleChange = (name: string, e: SelectChangeEvent) => {
    switch (name) {
      case 'selectedFloor':
        const newFloor =
          floors.find((floor) => floor.id === e.target.value) || null;
        const newArea =
          areas.find((area) => area.floor === newFloor?.name) || null;
        setSelectedFloor(newFloor);
        setSelectedArea(newArea);
        break;
      case 'selectedArea':
        setSelectedArea(
          areas.find((area) => area.id === e.target.value) || null
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!isLoading && !isError) {
      const selectedFloor = floors[0];
      const selectedArea = areas.find(
        (area) => area.floor === selectedFloor?.name
      );

      setSelectedFloor(selectedFloor || null);
      setSelectedArea(selectedArea || null);
    }
  }, [areas, floors, isLoading, isError]);

  return (
    <>
      <Helmet title='Availability' />
      <UserWrapper title='Availability'>
        {isLoading && <LoadingIndicator />}
        {isError && <ErrorAlert />}
        {!isLoading && !isError && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='selectedFloor-label'>Floor</InputLabel>
                  <Select
                    labelId='selectedFloor-label'
                    id='selectedFloor'
                    value={selectedFloor?.id || ''}
                    label='Floor'
                    onChange={(e) => handleChange('selectedFloor', e)}
                  >
                    {floors.map((floor) => (
                      <MenuItem value={floor.id} key={floor.id}>
                        {floor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='selectedArea-label'>Area</InputLabel>
                  <Select
                    labelId='selectedArea-label'
                    id='selectedArea'
                    value={selectedArea?.id || ''}
                    label='Area'
                    onChange={(e) => handleChange('selectedArea', e)}
                  >
                    {areas
                      .filter((area) => area.floor === selectedFloor?.name)
                      .map((area) => (
                        <MenuItem value={area.id} key={area.id}>
                          {area.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {(!selectedArea || !selectedFloor) && (
              <Alert severity='info'>
                Please select a floor with its corresponding area to proceed.
              </Alert>
            )}
            {selectedArea && selectedFloor && (
              <>
                <Box
                  sx={{
                    mx: -0.5,
                    mb: 3,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {Array(selectedArea.rows)
                    .fill(null)
                    .map((row, rowIdx) => {
                      const hasXPath = selectedArea.xPaths.includes(rowIdx);
                      const nextHasXPath = selectedArea.xPaths.includes(
                        rowIdx + 1
                      );

                      return (
                        <Box
                          key={rowIdx}
                          sx={{
                            mx: 'auto',
                            overflowX: 'visible',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                          }}
                        >
                          {Array(selectedArea.cols)
                            .fill(null)
                            .map((col, colIdx) => {
                              const currentLot = lots.find(
                                (lot) =>
                                  selectedArea.name === lot.area &&
                                  selectedFloor.name === lot.floor &&
                                  getLotFromCoords(
                                    selectedArea.cols,
                                    rowIdx + 1,
                                    colIdx + 1
                                  ) === lot.lotNumber
                              );

                              const isReserved =
                                currentLot &&
                                !isLotAvailable(
                                  reservations.filter(
                                    (reservation) =>
                                      reservation.lotNumber ===
                                        currentLot?.lotNumber &&
                                      reservation.area === currentLot?.area &&
                                      reservation.floor === currentLot?.floor &&
                                      !reservation.earlyEnd
                                  ),
                                  {
                                    dateTime: new Date(),
                                    duration: 0,
                                    floor: currentLot.floor,
                                    area: currentLot.area,
                                    lotNumber: currentLot.lotNumber,
                                    reserver: '',
                                    plateNumber: '',
                                    earlyEnd: false,
                                    createdAt: new Date(),
                                  }
                                );

                              const status = !!currentLot
                                ? !currentLot.available
                                  ? 'occupied'
                                  : isReserved
                                  ? 'reserved'
                                  : 'available'
                                : 'not available';

                              const availabilityColor =
                                getAvailabilityColor(status);

                              const hasYPath =
                                selectedArea.yPaths.includes(colIdx);

                              const nextHasYPath = selectedArea.yPaths.includes(
                                colIdx + 1
                              );

                              const isHidden =
                                !!currentLot &&
                                selectedArea.hiddenLots.includes(
                                  currentLot.lotNumber
                                );

                              const tooltipTitle = currentLot
                                ? `Lot ${currentLot.lotNumber} (${status})`
                                : 'Not available';

                              return (
                                <Box
                                  key={colIdx}
                                  sx={[
                                    {
                                      position: 'relative',
                                      display: 'inline-block',
                                      mt: hasXPath ? -0.25 : 0,
                                      mb: nextHasXPath ? -0.25 : 0,
                                      padding: 0.5,
                                      borderTop: `${hasXPath ? 4 : 0}px solid ${
                                        grey[200]
                                      }`,
                                      borderBottom: `${
                                        nextHasXPath ? 4 : 0
                                      }px solid ${grey[200]}`,
                                      borderLeft: `${
                                        hasYPath ? 4 : 0
                                      }px solid ${grey[200]}`,
                                    },
                                    hasXPath &&
                                      hasYPath && {
                                        '&:before': {
                                          content: '""',
                                          position: 'absolute',
                                          top: -42,
                                          left: -42,
                                          width: 80,
                                          height: 80,
                                          backgroundColor: 'background.default',
                                        },
                                      },
                                  ]}
                                >
                                  <Box
                                    sx={[
                                      {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 90,
                                        height: 120,
                                        userSelect: 'none',
                                        backgroundColor: alpha(
                                          availabilityColor,
                                          0.1
                                        ),
                                        borderRadius: 2,
                                        mt: hasXPath ? 4 : 0,
                                        mb: nextHasXPath ? 4 : 0,
                                        ml: hasYPath ? 4 : 0,
                                        mr: nextHasYPath ? 4 : 0,
                                      },
                                      isHidden && {
                                        visibility: 'hidden',
                                      },
                                    ]}
                                  >
                                    <Tooltip title={tooltipTitle}>
                                      <CircleIcon
                                        style={{
                                          fontSize: '2rem',
                                          color: availabilityColor,
                                        }}
                                      />
                                    </Tooltip>
                                  </Box>
                                </Box>
                              );
                            })}
                        </Box>
                      );
                    })}
                </Box>
                <ul style={{ padding: 0 }}>
                  {STATUSES.map((status) => (
                    <Box component='li' sx={{ display: 'flex' }} key={status}>
                      <CircleIcon
                        style={{
                          fontSize: '1.25rem',
                          marginRight: '0.5rem',
                          color: getAvailabilityColor(status),
                        }}
                      />
                      <Typography>{capitalize(status)}</Typography>
                    </Box>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </UserWrapper>
    </>
  );
};

export default Availability;
