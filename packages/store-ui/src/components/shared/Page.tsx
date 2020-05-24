import React from 'react';
import { Flex, Title, Box } from '@sradevski/blocks-ui';

interface PageProps {
  title?: string;
  maxWidth?: 0 | 1 | 2;
  children: React.ReactNode;
}

export const Page = ({ title, maxWidth, children }: PageProps) => {
  return (
    <Flex
      flexDirection='column'
      justifyContent='flex-start'
      width='100%'
      maxWidth={1920}
      minHeight='100vh'
      px={[2, 4, 5]}
      mt={title ? 0 : 5}
    >
      {title && (
        <Title mx='auto' mt={3} mb={4} fontSize={[5, 6, 6]} level={1}>
          {title}
        </Title>
      )}
      <Box width={'100%'} mx='auto' maxWidth={maxWidth}>
        {children}
      </Box>
    </Flex>
  );
};
