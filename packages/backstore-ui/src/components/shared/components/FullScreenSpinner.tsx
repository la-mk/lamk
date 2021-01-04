import React from 'react';
import { Spinner, Flex } from '@la-mk/blocks-ui';

export const FullScreenSpinner = () => {
  return (
    <Spinner isLoaded={false} size='lg'>
      <Flex height='100vh' width='100vh' />
    </Spinner>
  );
};
