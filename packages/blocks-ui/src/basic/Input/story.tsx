import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Input } from './';
import { Provider } from '../../';

storiesOf('Input', module).add('standard', () => (
  <Provider>
    <div>
      <Input />
      <Input mt={4} size="lg" leftAddon="Hey" />
      <Input type="password" mt={4} leftAddon="Hey" />
      <Input variant="flushed" type="search" mt={4} onSearch={alert} />
    </div>
  </Provider>
));
