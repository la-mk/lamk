import React from 'react';
import { Flex } from '../../../component-lib/basic/Flex';
import { Title } from '../../../component-lib/basic/Typography';
import { Tabs, TabPane } from '../../../component-lib/basic/Tabs';
import { AccountPreferences } from './AccountPreferences';
import { StorePreferences } from './StorePreferences';
import { DeliveryPreferences } from './DeliveryPreferences';

interface PreferencesProps {
  tab?: string;
  setTab: (tab: string) => void;
}

export const Preferences = ({ tab, setTab }: PreferencesProps) => {
  return (
    <Flex flexDirection='column' px={[3, 3, 3, 4]} py={2}>
      <Title mb={3} level={2}>
        Preferences
      </Title>
      <Tabs animated={false} activeKey={tab} onChange={setTab}>
        <TabPane tab={'Store'} key='store'>
          <StorePreferences />
        </TabPane>
        <TabPane tab={'Delivery'} key='delivery'>
          <DeliveryPreferences />
        </TabPane>
        <TabPane tab={'Account'} key='account'>
          <AccountPreferences />
        </TabPane>
      </Tabs>
    </Flex>
  );
};
