import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Divider } from './';
import { Provider } from '../../';

storiesOf('Divider', module).add('standard', () => (
  <Provider>
    <div style={{ height: '50px' }}>
      <Divider />
      <Divider mt={3} orientation="vertical" />
      <Divider mt={3} display={['none', 'none', 'block']} />
      <Divider mt={3} borderColor={'blue'} />
    </div>
  </Provider>
));
