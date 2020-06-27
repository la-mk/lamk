import React from 'react';
import { Flex, Text, Box, PoweredBy, Image } from '@sradevski/blocks-ui';
import { withTheme } from 'styled-components';
import { BlocksTheme } from '@sradevski/blocks-ui/dist/theme';

export const SubFooter = withTheme(({ theme }: { theme: BlocksTheme }) => {
  return (
    <Flex
      justifyContent={['center', 'space-between', 'space-between']}
      alignItems='center'
      px={[3, 4, 5]}
      flexDirection={['column', 'row', 'row']}
    >
      <Text color='text.light' fontSize={0} mr={[0, 3, 3]} mb={[3, 0, 0]}>
        © 2020 All rights reserved
      </Text>

      {/* <PoweredBy logoUrl={'/images/lamk-logo/horizontal-inverse.svg'} inverse /> */}

      <Flex
        mt={[3, 0, 0]}
        ml={[0, 3, 3]}
        justifyContent='center'
        alignItems='center'
      >
        <Box mr={2} p={2} bg='background.light'>
          <Box height={22}>
            <Image
              height={22}
              src={'/images/mastercard.svg'}
              alt='mastercard logo'
            />
          </Box>
        </Box>
        <Box ml={2} p={2} bg='background.light'>
          <Box height={22}>
            <Image height={22} src={'/images/visa.svg'} alt='visa logo' />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
});
