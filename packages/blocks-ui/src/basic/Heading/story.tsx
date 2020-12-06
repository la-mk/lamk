import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Heading } from '.';
import { Provider } from '../..';

storiesOf('Heading', module).add('standard', () => (
  <Provider>
    <div>
      <Heading size="xs">Hey there</Heading>
      <Heading mt={3} size="lg" as="h1" align="center">
        This is bold
      </Heading>
    </div>
  </Provider>
));
