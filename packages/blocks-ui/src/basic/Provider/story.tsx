import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Provider } from './';
import { Button } from '../../';

storiesOf('Provider', module).add('standard', () => (
  <Provider>
    <>
      <Button>Hey</Button>
    </>
  </Provider>
));
