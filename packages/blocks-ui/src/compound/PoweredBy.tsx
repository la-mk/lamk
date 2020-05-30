import React from 'react';
import { Image, Flex, Text } from '../';

export const PoweredBy = ({ inverse, logoUrl }: { inverse?: boolean, logoUrl: string; }) => {
  return (
    <a style={{ textDecoration: 'none' }} href='https://la.mk' target='_blank'>
      <Flex display="inline-flex" alignItems='center' justifyContent='center'>
        <Text color={inverse ? 'text.light' : 'text.dark'} fontSize={0} mr={2}>
          powered by
        </Text>
        <Image
         src={logoUrl}
         height={22}
         maxWidth={80}
         alt='la.mk logo'
       />
      </Flex>
    </a>
  );
};
