import { Box, Flex } from '@la-mk/blocks-ui';
import React from 'react';
import { AccountMenu } from './AccountMenu';

export const Account = () => {
  return (
    <Flex>
      <Box display={['block', 'none', 'none']} width='100%'>
        <AccountMenu />
      </Box>
    </Flex>
  );
};
