import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Textarea } from '.';
import { Provider } from '../..';

storiesOf('Textarea', module).add('standard', () => (
  <Provider>
    <div>
      <Textarea />
      <Textarea resize="both" rows={5} />
    </div>
  </Provider>
));
