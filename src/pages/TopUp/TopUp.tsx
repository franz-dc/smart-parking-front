import { ChangeEvent, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { UserWrapper } from '~/components';
import { AppBar, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { SelectTopUp, TopUpHistory } from './Tabs';

const TopUp = () => {
  const [currentTabValue, setCurrentTabValue] = useState('0');

  const handleTabChange = (event: ChangeEvent<{}>, newValue: string) => {
    setCurrentTabValue(newValue);
  };

  const tabItems = [
    {
      name: 'Top-up',
      component: SelectTopUp,
    },
    {
      name: 'History',
      component: TopUpHistory,
    },
  ];

  return (
    <>
      <Helmet title='Top-up Credits' />
      <UserWrapper title='Top-up Credits'>
        <TabContext value={currentTabValue}>
          <AppBar
            position='static'
            color='transparent'
            elevation={0}
            sx={{ marginTop: -2 }}
          >
            <TabList
              onChange={handleTabChange}
              aria-label='top-up tabs'
              variant='scrollable'
            >
              {tabItems.map((tabItem, index) => (
                <Tab
                  key={index}
                  label={tabItem.name}
                  value={index.toString()}
                />
              ))}
            </TabList>
          </AppBar>
          {tabItems.map((tabItem, index) => (
            <TabPanel key={index} value={index.toString()}>
              <tabItem.component />
            </TabPanel>
          ))}
        </TabContext>
      </UserWrapper>
    </>
  );
};

export default TopUp;
