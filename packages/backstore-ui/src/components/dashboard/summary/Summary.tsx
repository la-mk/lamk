import React from 'react';
import { TopStatistics } from './TopStatistics';
import { Revenue } from './Revenue';
import { Orders } from './Orders';
import { Grid, Box } from '@sradevski/blocks-ui';
import { Visits } from './Visits';
import { StoreLink } from './StoreLink';

export const Summary = () => {
  return (
    <Box p={3}>
      <StoreLink />

      <TopStatistics />

      <Grid mt={3} spacing={5} minChildWidth='380px'>
        <Revenue />
        <Orders />
      </Grid>

      <Box mt={3}>
        <Visits />
      </Box>
    </Box>
  );
};
