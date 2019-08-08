import React from 'react';
import { Sets } from './Sets/Sets';
import { Banner } from './Banner';
import { Flex } from 'blocks-ui/dist/basic/Flex';

export const Store = () => (
  <Flex flexDirection='column'>
    <Banner />
    <Flex flexDirection='column' px={50}>
      <Sets />
    </Flex>
  </Flex>
);
