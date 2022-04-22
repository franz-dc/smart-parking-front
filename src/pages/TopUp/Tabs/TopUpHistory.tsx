import { Paper } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridValueFormatterParams,
  GridSortModel,
} from '@mui/x-data-grid';
import { format } from 'date-fns';
import { useQuery } from 'react-query';
import { topUpsService } from '~/services';
import { useUserContext } from '~/hooks';
import { LoadingIndicator, ErrorAlert } from '~/components';
import { capitalize, formatCurrency } from '~/utils';

const TopUpHistory = () => {
  const { user } = useUserContext();

  const { data, isLoading, isError } = useQuery(
    ['userTopUpHistory', { userId: user?.uid }],
    () => topUpsService.getTopUpsByUser(user?.uid || ''),
    {
      enabled: !!user,
    }
  );

  const topUps = data || [];

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date created',
      type: 'dateTime',
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        format(params.value as Date, 'PPp'),
    },
    {
      field: 'platform',
      headerName: 'Platform',
      width: 150,
    },
    {
      field: 'referenceNumber',
      headerName: 'Reference number',
      width: 200,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      width: 150,
      valueFormatter: (params: GridValueFormatterParams) =>
        formatCurrency(params.value as number),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      valueGetter: (params: GridValueGetterParams) =>
        capitalize(params.value as string),
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
      <Paper sx={{ p: 2 }}>
        {isLoading && <LoadingIndicator />}
        {isError && <ErrorAlert />}
        {!isLoading && !isError && (
          <DataGrid
            columns={columns}
            rows={topUps}
            initialState={{
              sorting: {
                sortModel,
              },
            }}
            autoHeight
            loading={isLoading}
          />
        )}
      </Paper>
    </>
  );
};

export default TopUpHistory;
