import React from 'react';
import { Flex, Heading, Box } from '@sradevski/blocks-ui';

interface PageProps {
  title?: string;
  maxWidth?: number | string;
  children: React.ReactNode;
}

export const Page = ({ title, maxWidth, children }: PageProps) => {
  return (
    <Flex
      direction='column'
      justify='flex-start'
      width='100%'
      maxWidth={maxWidth ?? 1920}
      px={[3, 5, 6]}
      mt={title ? 0 : 5}
      mx='auto'
    >
      {title && (
        <Heading mx='auto' my={7} size={'2xl'} as='h1'>
          {title}
        </Heading>
      )}
      <Box width={'100%'} mx='auto'>
        {children}
      </Box>
    </Flex>
  );
};
