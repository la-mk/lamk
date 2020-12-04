import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Select } from './';
import { Provider } from '../../';

storiesOf('Select', module).add('standard', () => (
  <Provider>
    <div>
      <Select
        size="sm"
        options={[
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
          { label: 'Three', value: 'three' },
        ]}
      />
    </div>
  </Provider>
));
