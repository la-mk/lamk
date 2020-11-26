import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Flex } from './';
import { Provider, Card } from '../../';

storiesOf('Flex', module).add('standard', () => (
  <Provider>
    <div>
      <Flex direction="column" align="center" justify="center">
        <Card my={3}>Hey</Card>
        <Card my={3}>Hey</Card>
        <Card my={3}>Hey</Card>
        <Card my={3}>Hey</Card>
      </Flex>
    </div>
  </Provider>
));
