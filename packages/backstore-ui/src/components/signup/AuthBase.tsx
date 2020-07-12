import React from 'react';
import { Flex } from '@sradevski/blocks-ui';
import { CustomCard } from '../shared/components/CustomCard';

export const AuthBase = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      width='100vw'
      height='100vh'
      alignItems='center'
      justifyContent='center'
      bg='background.light'
    >
      <CustomCard
        bg='#fff'
        width={460}
        minWidth={320}
        flexDirection='column'
        alignItems='center'
        p={4}
      >
        {children}
      </CustomCard>
    </Flex>
  );
};
