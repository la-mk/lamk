import React from 'react';
import { Flex, Title, Tabs, TabPane } from '@lamk/blocks-ui';
import { StorePreferences } from './StorePreferences';
import { DeliveryPreferences } from './DeliveryPreferences';
import { InterfacePreferences } from './InterfacePreferences';
import { useTranslation } from 'react-i18next';

interface PreferencesProps {
  tab?: string;
  setTab: (tab: string) => void;
}

export const Preferences = ({ tab, setTab }: PreferencesProps) => {
  const {t} = useTranslation();
  return (
    <Flex flexDirection='column' px={[3, 3, 3, 4]} py={2}>
      <Title mb={3} level={2}>
        {t('common.preferences')}
      </Title>
      <Tabs animated={false} activeKey={tab} onChange={setTab}>
        <TabPane tab={t('commerce.store')} key='store'>
          <StorePreferences />
        </TabPane>
        <TabPane tab={t('commerce.delivery')} key='delivery'>
          <DeliveryPreferences />
        </TabPane>
        <TabPane tab={t('common.interface')} key='interface'>
          <InterfacePreferences />
        </TabPane>
      </Tabs>
    </Flex>
  );
};
