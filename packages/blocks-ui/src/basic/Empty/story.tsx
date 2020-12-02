import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Empty } from './';
import { Provider } from '../../';

storiesOf('Empty', module).add('standard', () => (
  <Provider>
    <div>
      <Empty title="No data" description="There is no data found" />
      <Empty mt={6} description="There is no data found" />
    </div>
  </Provider>
));
