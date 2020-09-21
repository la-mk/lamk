import { Flex, FlexProps } from '../../basic/Flex';
import React from 'react';

export const BaseSection = (props: FlexProps) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      width={'100%'}
      maxWidth={600}
      minWidth={200}
      mx="auto"
      {...props}
    />
  );
};
