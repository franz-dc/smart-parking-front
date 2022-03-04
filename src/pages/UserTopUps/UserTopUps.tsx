import { ChangeEvent, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { GridRowParams, GridActionsCellItem } from '@mui/x-data-grid';
import { Check as CheckIcon, Close as CloseIcon } from 'mdi-material-ui';
import { AdminWrapper } from 'components';
import { topUpsService } from 'services';
import { ITopUp, IUpdateTopUpParams } from 'types';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import UserTopUpsBase from './UserTopUpsBase';

const UserTopUps = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [currentTabValue, setCurrentTabValue] = useState('0');

  const handleTabChange = (event: ChangeEvent<{}>, newValue: string) => {
    setCurrentTabValue(newValue);
  };

  const { mutateAsync: approveTopUpMutateAsync } = useMutation(
    topUpsService.approveTopUp,
    {
      onSuccess: (data) => {
        queryClient.setQueryData<ITopUp[]>(
          ['topUps', { status: 'credited' }],
          (prevData) =>
            prevData ? prevData.filter((topUp) => topUp.id !== data.id) : []
        );
        enqueueSnackbar('Top-up status approved', {
          variant: 'success',
        });
      },
      onError: () => {
        enqueueSnackbar('Failed to update top-up status', {
          variant: 'error',
        });
      },
    }
  );

  const { mutateAsync: rejectTopUpMutateAsync } = useMutation(
    topUpsService.updateTopUp,
    {
      onSuccess: (data) => {
        queryClient.setQueryData<ITopUp[]>(
          ['topUps', { status: 'rejected' }],
          (prevData) =>
            prevData ? prevData.filter((topUp) => topUp.id !== data.id) : []
        );
        enqueueSnackbar('Top-up status rejected', {
          variant: 'success',
        });
      },
      onError: () => {
        enqueueSnackbar('Failed to update top-up status', {
          variant: 'error',
        });
      },
    }
  );

  const approveTopUp = async (params: IUpdateTopUpParams) =>
    await approveTopUpMutateAsync(params);

  const rejectTopUp = async (params: IUpdateTopUpParams) =>
    await rejectTopUpMutateAsync({
      ...params,
      status: 'rejected',
    });

  const tabItems = [
    {
      name: 'Pending',
      component: () => (
        <UserTopUpsBase
          status='pending'
          additionalColumns={[
            {
              field: 'actions',
              type: 'actions',
              // @ts-ignore
              getActions: (params: GridRowParams<ITopUp>) => {
                const { id, userDetails, ...topUp } = params.row;

                return [
                  <GridActionsCellItem
                    icon={<CheckIcon />}
                    onClick={() => approveTopUp({ id, topUp })}
                    label='approve'
                  />,
                  <GridActionsCellItem
                    icon={<CloseIcon />}
                    onClick={() => rejectTopUp({ id, topUp })}
                    label='reject'
                  />,
                ];
              },
            },
          ]}
        />
      ),
    },
    {
      name: 'Credited',
      component: () => <UserTopUpsBase status='credited' />,
    },
    {
      name: 'Rejected',
      component: () => <UserTopUpsBase status='rejected' />,
    },
  ];

  return (
    <AdminWrapper title='User Top-ups'>
      <Helmet title='User Top-ups' />
      <TabContext value={currentTabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: -1 }}>
          <TabList
            onChange={handleTabChange}
            aria-label='top-up tabs'
            variant='scrollable'
            textColor='secondary'
            indicatorColor='secondary'
          >
            {tabItems.map((tabItem, index) => (
              <Tab key={index} label={tabItem.name} value={index.toString()} />
            ))}
          </TabList>
        </Box>
        {tabItems.map((tabItem, index) => (
          <TabPanel key={index} value={index.toString()}>
            <tabItem.component />
          </TabPanel>
        ))}
      </TabContext>
    </AdminWrapper>
  );
};

export default UserTopUps;
