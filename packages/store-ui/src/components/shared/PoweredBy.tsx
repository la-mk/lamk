import React from 'react';
import { Flex, Text, Image } from '@sradevski/blocks-ui';

export const PoweredBy = ({ inverse }: { inverse?: boolean }) => {
  return (
    <a style={{ textDecoration: 'none' }} href='https://la.mk' target='_blank'>
      <Flex alignItems='center' justifyContent='center'>
        <Text color={inverse ? 'text.light' : 'text.dark'} fontSize={0} mr={2}>
          powered by
        </Text>
        <Image
          src={`/images/lamk-logo/${
            inverse ? 'horizontal-inverse' : 'horizontal'
          }.svg`}
          height={22}
          alt='la.mk logo'
        />
      </Flex>
    </a>
  );
};
