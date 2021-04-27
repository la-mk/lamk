import * as React from 'react';
import { Flex, Heading, Text } from '@la-mk/blocks-ui';
import { Delivery } from '@la-mk/la-sdk/dist/models/delivery';
import { DeliveryForm } from '../shared/forms/DeliveryForm';
import { useTranslation } from 'react-i18next';

interface SetupDeliveryProps {
  onDone: ({ formData }: { formData: Delivery }) => void;
  delivery: Delivery | null;
}

export const SetupDelivery = ({ onDone, delivery }: SetupDeliveryProps) => {
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
      <DeliveryForm delivery={delivery} onSubmit={onDone} />
    </>
  );
};
