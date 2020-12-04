import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Badge } from './';
import { Provider } from '../../';

storiesOf('Badge', module).add('standard', () => (
  <Provider>
    <div>
      <Badge colorScheme="green" variant="solid" borderRadius="full" size="xs">
        0
      </Badge>
    </div>
  </Provider>
));
