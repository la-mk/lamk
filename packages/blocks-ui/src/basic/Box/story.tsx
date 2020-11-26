import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Box } from '.';
import { Provider } from '../..';

storiesOf('Box', module).add('standard', () => (
  <Provider>
    <div>
      <Box>I'm a box</Box>
    </div>
  </Provider>
));
