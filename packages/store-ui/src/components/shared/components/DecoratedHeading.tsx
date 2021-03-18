import { Box, Flex, Heading, hooks } from '@la-mk/blocks-ui';
import React from 'react';

const Decoration = ({ direction }: { direction: 'left' | 'right' }) => {
  const measurements = hooks.useBreakpoint([
    {
      width: 12,
      position: 6,
    },
    {
      width: 120,
      position: 114,
    },
    {
      width: 120,
      position: 114,
    },
  ]);
  return (
    <Box color='primary.100'>
      <svg
        width={measurements.width}
        height='12'
        viewBox={`0 0 ${measurements.width} 12`}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <rect
          width='8.5'
          height='8.5'
          transform={`translate(${
            direction === 'right' ? measurements.position.toString() : '6'
          }, 0) rotate(45)`}
          fill='currentColor'
        />
        {measurements.width > 12 && (
          <rect
            width='96'
            height='2'
            y='5'
            x={direction === 'left' ? '24' : '0'}
            fill='currentColor'
          />
        )}
      </svg>
    </Box>
  );
};

export const DecoratedHeading = ({
  children,
  ...props
}: React.ComponentProps<typeof Heading>) => {
  return (
    <Flex mb={3} align='center' justify='center'>
      <Decoration direction='right' />
      <Heading {...props}>{children}</Heading>
      <Decoration direction='left' />
    </Flex>
  );
};
