import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Grid } from './';
import { Provider, Box } from '../../';

storiesOf('Grid', module).add('standard', () => (
  <Provider>
    <div>
      <Grid minChildWidth="220px" spacing={5}>
        <Box bg="tomato" height="80px" maxWidth="220px" />
        <Box bg="tomato" height="80px" maxWidth="220px" />
        <Box bg="tomato" height="80px" maxWidth="220px" />
        <Box bg="tomato" height="80px" maxWidth="220px" />
        <Box bg="tomato" height="80px" maxWidth="220px" />
        <Box bg="tomato" height="80px" maxWidth="220px" />
        <Box bg="tomato" height="80px" maxWidth="220px" />
        <Box bg="tomato" height="80px" maxWidth="220px" />
        <Box bg="tomato" height="80px" maxWidth="220px" />
      </Grid>
    </div>
  </Provider>
));
