import { ChangeEvent, useState } from 'react';
import { UserWrapper } from 'components';
import { Helmet } from 'react-helmet-async';
import { AppBar, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Profile, Security } from './Tabs';

const AccountSettings = () => {
  const [currentTabValue, setCurrentTabValue] = useState('0');

  const handleTabChange = (event: ChangeEvent<{}>, newValue: string) => {
    setCurrentTabValue(newValue);
  };

  const tabItems = [
    {
      name: 'Profile',
      component: Profile,
    },
    {
      name: 'Security',
      component: Security,
    },
  ];

  return (
    <UserWrapper title='Account Settings'>
      <Helmet title='Account Settings' />
      <TabContext value={currentTabValue}>
        <AppBar
          position='static'
          color='transparent'
          elevation={0}
          sx={{ marginTop: -2 }}
        >
          <TabList
            onChange={handleTabChange}
            aria-label='account settings tabs'
            variant='scrollable'
          >
            {tabItems.map((tabItem, index) => (
              <Tab key={index} label={tabItem.name} value={index.toString()} />
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
  );
};

export default AccountSettings;
