import * as React from 'react';
import { Col, Flex, Title, Text } from '@lamk/blocks-ui';
import { Delivery } from '@lamk/la-sdk/dist/models/delivery';
import { DeliveryForm } from '../shared/forms/DeliveryForm';

interface SetupDeliveryProps {
  onDone: (newDelivery?: Delivery) => void;
  delivery: Delivery | null;
}

export const SetupDelivery = ({ onDone, delivery }: SetupDeliveryProps) => {
  return (
    <Col>
      <Flex mb={5} alignItems='center' flexDirection='column'>
        <Title level={3}>Finally, let's tell users about our delivery</Title>
        <Text type='secondary'>
          Don't worry, you can modify things later as well.
        </Text>
      </Flex>
      <DeliveryForm delivery={delivery} onDone={onDone} />
    </Col>
  );
};
