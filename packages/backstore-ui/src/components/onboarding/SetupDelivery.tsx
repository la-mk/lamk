import * as React from 'react';
import { Col, Flex, Title, Text } from '@sradevski/blocks-ui';
import { Delivery } from '@sradevski/la-sdk/dist/models/delivery';
import { DeliveryForm } from '../shared/forms/DeliveryForm';
import { useTranslation } from 'react-i18next';
import { Store } from '@sradevski/la-sdk/dist/models/store';

interface SetupDeliveryProps {
  onDone: (newDelivery?: Delivery) => void;
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
    <Col>
      <Flex mb={5} alignItems='center' flexDirection='column'>
        <Title level={3}>{t('onboarding.setupDeliveryTitle')}</Title>
        <Text type='secondary'>{t('onboarding.setupDeliverySubtitle')}</Text>
      </Flex>
      <DeliveryForm storeId={storeId} delivery={delivery} onDone={onDone} />
    </Col>
  );
};
