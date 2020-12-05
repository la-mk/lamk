import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Text } from './';
import { Provider } from '../../';

storiesOf('Text', module).add('standard', () => (
  <Provider>
    <div>
      <Text size="xs">Hey there</Text>
      <Text mt={3} size="xs" as="strong">
        This is bold
      </Text>
    </div>
  </Provider>
));
