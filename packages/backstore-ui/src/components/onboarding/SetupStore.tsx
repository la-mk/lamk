import * as React from 'react';
import { Col, Title, Flex, Text } from '@lamk/blocks-ui';
import { Store } from '@lamk/la-sdk/dist/models/store';
import { StoreForm } from '../shared/forms/StoreForm';

interface SetupStoreProps {
  onDone: (newStore?: Store) => void;
  store: Store | null;
}

export const SetupStore = ({ onDone, store }: SetupStoreProps) => {
  return (
    <Col>
      <Flex mb={5} alignItems='center' flexDirection='column'>
        <Title level={3}>Let's kick things off by creating our store</Title>
        <Text type='secondary'>
          Don't worry, you can modify things later as well.
        </Text>
      </Flex>
      <StoreForm store={store} onDone={onDone} />
    </Col>
  );
};
