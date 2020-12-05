import * as React from 'react';
import { Flex, Heading, Text } from '@sradevski/blocks-ui';
import { Delivery } from '@sradevski/la-sdk/dist/models/delivery';
import { DeliveryForm } from '../shared/forms/DeliveryForm';
import { useTranslation } from 'react-i18next';
import { Store } from '@sradevski/la-sdk/dist/models/store';

interface SetupDeliveryProps {
  onDone: ({ formData }: { formData: Delivery }) => void;
  delivery: Delivery | null;
  storeId: Store['_id'] | undefined;
}

export const SetupDelivery = ({
  storeId,
  onDone,
  delivery,
}: SetupDeliveryProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex mb={6} align='center' direction='column'>
        <Heading align='center' as='h3'>
          {t('onboarding.setupDeliveryTitle')}
        </Heading>
        <Text align='center' color='secondary'>
          {t('onboarding.setupDeliverySubtitle')}
        </Text>
      </Flex>
      <DeliveryForm storeId={storeId} delivery={delivery} onSubmit={onDone} />
    </>
  );
};
