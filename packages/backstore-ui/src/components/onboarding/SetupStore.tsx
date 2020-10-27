import * as React from 'react';
import { Col, Title, Flex, Text, Box } from '@sradevski/blocks-ui';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { StoreForm } from '../shared/forms/StoreForm';
import { useTranslation } from 'react-i18next';
import { User } from '@sradevski/la-sdk/dist/models/user';

interface SetupStoreProps {
  onDone: ({ formData }: { formData: Store }) => void;
  store: Store | null;
  userId: User['_id'] | undefined;
}

export const SetupStore = ({ onDone, store, userId }: SetupStoreProps) => {
  const { t } = useTranslation();
  return (
    <Col>
      <Flex mb={6} alignItems='center' flexDirection='column'>
        <Title level={3}>{t('onboarding.setupStoreTitle')}</Title>
        <Text color='secondary'>{t('onboarding.setupStoreSubtitle')}</Text>
      </Flex>
      <Flex
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        width={'100%'}
        maxWidth={800}
        minWidth={300}
        mx='auto'
      >
        <Box width='100%'>
          <StoreForm store={store} userId={userId} onDone={onDone} />
        </Box>
      </Flex>
    </Col>
  );
};
