import * as React from 'react';
import { Heading, Flex, Text, Box } from '@la-mk/blocks-ui';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { StoreForm } from '../shared/forms/StoreForm';
import { useTranslation } from 'react-i18next';
import { User } from '@la-mk/la-sdk/dist/models/user';

interface SetupStoreProps {
  onDone: ({ formData }: { formData: Store }) => void;
  store: Store | null;
  userId: User['_id'] | undefined;
}

export const SetupStore = ({ onDone, store, userId }: SetupStoreProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Flex mb={6} align='center' direction='column'>
        <Heading align='center' as='h3'>
          {t('onboarding.setupStoreTitle')}
        </Heading>
        <Text align='center' color='secondary'>
          {t('onboarding.setupStoreSubtitle')}
        </Text>
      </Flex>
      <Flex
        align='center'
        justify='center'
        direction='column'
        width={'100%'}
        maxWidth={800}
        minWidth={300}
        mx='auto'
      >
        <Box width='100%'>
          <StoreForm store={store} userId={userId} onDone={onDone} />
        </Box>
      </Flex>
    </>
  );
};
