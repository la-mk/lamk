import React from 'react';
import { Flex } from '../basic/Flex';
import { Box } from '../basic/Box';
import { Image } from '../basic/Image/Image';
import { Text } from '../basic/Text';

export const PoweredBy = ({
  inverse,
  logoUrl,
}: {
  inverse?: boolean;
  logoUrl: string;
}) => {
  return (
    <a style={{ textDecoration: 'none' }} href="https://la.mk" target="_blank">
      <Flex display="inline-flex" align="center" justify="center">
        <Text
          as="strong"
          color={inverse ? 'text.light' : 'text.dark'}
          size={'xs'}
          mr={2}
        >
          powered by
        </Text>
        <Box lineHeight={1} maxWidth={80} height={22}>
          <Image src={logoUrl} alt="la.mk logo" />
        </Box>
      </Flex>
    </a>
  );
};
