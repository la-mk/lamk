import React from 'react';
import { Flex, Box } from '@la-mk/blocks-ui';
import { LineEndDot } from './LineEndDot';
import { CurvedDashedLine } from './CurvedDashedLine';
import { HumanLaptopPlant } from './HumanLaptopPlant';
import { MiniShopWindow } from './MiniShopWindow';

// We load the images as code so on initial load they don't flash appear and are immediately loaded
export const HeroIllustration = () => {
  return (
    <Flex
      width='100%'
      maxWidth={1120}
      mt={[3, -5, -5]}
      // @ts-ignore
      style={{ position: 'relative' }}
      justify='center'
    >
      <Box mt={5} display={['none', 'block', 'block']}>
        <MiniShopWindow />
      </Box>

      <Box
        // @ts-ignore
        style={{ position: 'relative' }}
        flex={1}
        width='100%'
        display={['none', 'block', 'block']}
      >
        <CurvedDashedLine
          style={{ position: 'absolute', bottom: -16, right: -20 }}
        />
        <LineEndDot
          style={{
            position: 'absolute',
            bottom: 'max(calc(190px - 14vw), 16px)',
            left: 0,
          }}
        />
      </Box>

      <HumanLaptopPlant />
      <Box
        display={['none', 'block', 'block']}
        // @ts-ignore
        style={{ position: 'absolute', top: 120, right: 246 }}
      >
        <LineEndDot />
      </Box>
    </Flex>
  );
};
