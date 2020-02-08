import React from 'react';
import { Flex, Title } from '@sradevski/blocks-ui';

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
      minHeight='100vh'
      px={[2, 4, 5]}
      mt={title ? 0 : 5}
    >
      {title && (
        <Title mt={3} mb={4} level={1}>
          {title}
        </Title>
      )}
      {children}
    </Flex>
  );
};
