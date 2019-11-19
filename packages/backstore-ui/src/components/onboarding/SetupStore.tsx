import * as React from 'react';
import { Col, Title, Flex, Text } from '@lamk/blocks-ui';
import { Store } from '@lamk/la-sdk/dist/models/store';
import { StoreForm } from '../shared/forms/StoreForm';
import { useTranslation } from 'react-i18next';
import { User } from '@lamk/la-sdk/dist/models/user';

interface SetupStoreProps {
  onDone: (newStore?: Store) => void;
  store: Store | null;
  userId: User['_id'] | undefined;
}

export const SetupStore = ({ onDone, store, userId }: SetupStoreProps) => {
  const {t} = useTranslation();
  return (
    <Col>
      <Flex mb={5} alignItems='center' flexDirection='column'>
        <Title level={3}>{t('onboarding.setupStoreTitle')}</Title>
        <Text type='secondary'>
          {t('onboarding.setupStoreSubtitle')}
        </Text>
      </Flex>
      <StoreForm store={store} userId={userId} onDone={onDone} />
    </Col>
  );
};
