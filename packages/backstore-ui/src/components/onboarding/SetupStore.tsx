import * as React from 'react';
import { Col, Title, Flex, Text } from '@lamk/blocks-ui';
import { Store } from '@lamk/la-sdk/dist/models/store';
import { StoreForm } from '../shared/forms/StoreForm';
import { useTranslation } from 'react-i18next';

interface SetupStoreProps {
  onDone: (newStore?: Store) => void;
  store: Store | null;
}

export const SetupStore = ({ onDone, store }: SetupStoreProps) => {
  const {t} = useTranslation();
  return (
    <Col>
      <Flex mb={5} alignItems='center' flexDirection='column'>
        <Title level={3}>{t('onboarding.setupStoreTitle')}</Title>
        <Text type='secondary'>
          {t('onboarding.setupStoreSubtitle')}
        </Text>
      </Flex>
      <StoreForm store={store} onDone={onDone} />
    </Col>
  );
};
