import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Stat } from './';
import { Provider } from '../../';

storiesOf('Stat', module).add('standard', () => (
  <Provider>
    <div>
      <Stat label="Sales" value="30,000$" description="One-month sales" />
    </div>
  </Provider>
));
