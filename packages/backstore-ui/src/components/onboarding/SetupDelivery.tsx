import * as React from 'react';
import { Col, Flex, Title, Text } from '@lamk/blocks-ui';
import { Delivery } from '@lamk/la-sdk/dist/models/delivery';
import { DeliveryForm } from '../shared/forms/DeliveryForm';
import { useTranslation } from 'react-i18next';

interface SetupDeliveryProps {
  onDone: (newDelivery?: Delivery) => void;
  delivery: Delivery | null;
}

export const SetupDelivery = ({ onDone, delivery }: SetupDeliveryProps) => {
  const {t} = useTranslation();

  return (
    <Col>
      <Flex mb={5} alignItems='center' flexDirection='column'>
        <Title level={3}>{t('onboarding.setupDeliveryTitle')}</Title>
        <Text type='secondary'>
          {t('onboarding.setupDeliverySubtitle')}
        </Text>
      </Flex>
      <DeliveryForm delivery={delivery} onDone={onDone} />
    </Col>
  );
};
