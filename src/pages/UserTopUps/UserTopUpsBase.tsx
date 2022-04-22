import { FC } from 'react';
import { Paper } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridValueFormatterParams,
  GridSortModel,
} from '@mui/x-data-grid';
import { LoadingIndicator, ErrorAlert } from '~/components';
import { useQuery } from 'react-query';
import { topUpsService, usersService } from '~/services';
import { format } from 'date-fns';
import { formatCurrency } from '~/utils';

interface UserTopUpsBaseProps {
  status: string;
  additionalColumns?: GridColDef[];
}

const UserTopUpsBase: FC<UserTopUpsBaseProps> = ({
  status,
  additionalColumns = [],
}) => {
  const topUpsQuery = useQuery(['topUps', { status }], () =>
    topUpsService.getTopUpsByStatus(status)
  );

  const topUps = topUpsQuery.data || [];

  const usersQuery = useQuery(
    ['users', `${status}TopUps`],
    () => usersService.getUsersByIds(topUps.map((topUp) => topUp.userId)),
    {
      enabled: topUps.length > 0,
    }
  );

  const populatedTopUps = topUps.map((topUp) => {
    const user = usersQuery.data?.find((user) => user.id === topUp.userId);
    return {
      ...topUp,
      userDetails: user,
    };
  });

  const isLoading = topUpsQuery.isLoading || usersQuery.isLoading;
  const isError = topUpsQuery.isError || usersQuery.isError;

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
      field: 'name',
      headerName: 'Creator',
      width: 220,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.userDetails
          ? `${params.row.userDetails?.firstName} ${params.row.userDetails?.lastName}`
          : '',
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 220,
      valueGetter: (params: GridValueGetterParams) =>
        params.row?.userDetails?.email || '',
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
    ...additionalColumns,
  ];

  const sortModel: GridSortModel = [
    {
      field: 'createdAt',
      sort: 'desc',
    },
  ];

  return (
    <>
      {isLoading && <LoadingIndicator />}
      {isError && <ErrorAlert />}
      {!isLoading && !isError && (
        <Paper sx={{ p: 2 }}>
          <DataGrid
            rows={populatedTopUps}
            columns={columns}
            initialState={{
              sorting: {
                sortModel,
              },
            }}
            autoHeight
            loading={isLoading}
          />
        </Paper>
      )}
    </>
  );
};

export default UserTopUpsBase;
