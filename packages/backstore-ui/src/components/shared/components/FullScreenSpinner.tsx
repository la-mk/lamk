import React from 'react';
import { Spin, Flex } from '@sradevski/blocks-ui';

export const FullScreenSpinner = () => {
  return (
    <Spin size='large'>
      <Flex height='100vh' width='100vh' />
    </Spin>
  );
};
