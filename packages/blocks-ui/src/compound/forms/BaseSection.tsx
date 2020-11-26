import { Flex, FlexProps } from '../../basic/Flex';
import React from 'react';

export const BaseSection = (props: FlexProps) => {
  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      width={'100%'}
      maxWidth={600}
      minWidth={200}
      mx="auto"
      {...props}
    />
  );
};
