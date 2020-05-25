import React from 'react';
import { Flex, Title, Box } from '@sradevski/blocks-ui';

interface PageProps {
  title?: string;
  maxWidth: number | string;
  children: React.ReactNode;
}

export const Page = ({ title, maxWidth, children }: PageProps) => {
  return (
    <Flex
      flexDirection='column'
      justifyContent='flex-start'
      width='100%'
      maxWidth={maxWidth ?? 1920}
      px={[2, 4, 5]}
      mt={title ? 0 : 5}
      mx='auto'
    >
      {title && (
        <Title mx='auto' my={4} fontSize={[5, 6, 6]} level={1}>
          {title}
        </Title>
      )}
      <Box width={'100%'} mx='auto'>
        {children}
      </Box>
    </Flex>
  );
};
