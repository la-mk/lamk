import React from 'react';
import { Title, Flex, Steps, Step, List } from 'blocks-ui';
import { Order as OrderType } from 'la-sdk/dist/models/order';

const getStepIndex = (status: OrderType['status']) => {
  switch (status) {
    case 'pending':
      return 0;
    case 'shipped':
      return 1;
    case 'completed':
    case 'cancelled':
      return 2;
  }
};

export const Order = ({ order }: { order: OrderType | null }) => {
  if (!order) {
    return <div>No order found</div>;
  }

  const status = order.status;
  const stepIndex = getStepIndex(status);

  return (
    <Flex mx={3} flexDirection='column' alignItems='center' mb={5}>
      <Title mb={5} level={1}>
        Order
      </Title>
      <Steps progressDot current={stepIndex}>
        <Step title='Pending' description='Awaiting shipment' />
        <Step title='Shipped' description='Awaiting arrival' />
        {status !== 'cancelled' && (
          <Step title='Completed' description='All done!' />
        )}
        {status === 'cancelled' && (
          <Step
            status='error'
            title='Cancelled'
            description='Order cancelled'
          />
        )}
      </Steps>

      <Flex mt={5}>
        <List>
          {order.ordered.map(orderItem => {
            return <List.Item>{orderItem.product.name}</List.Item>;
          })}
        </List>
      </Flex>
    </Flex>
  );
};
