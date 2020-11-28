import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Radio } from './';
import { Provider } from '../../';

storiesOf('Radio', module).add('standard', () => (
  <Provider>
    <div>
      <Radio
        options={[
          {
            children: 'First',
            value: 'first',
          },
          { children: 'Second', value: 'second' },
        ]}
        size="sm"
      />
    </div>
  </Provider>
));
