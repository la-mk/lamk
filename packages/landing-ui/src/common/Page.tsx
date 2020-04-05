import React from 'react';
import { Flex, Title } from '@sradevski/blocks-ui';

interface PageProps {
  title: string;
  children: React.ReactNode;
}

export const Page = ({ title, children }: PageProps) => {
  return (
    <Flex
      flexDirection='column'
      justifyContent='flex-start'
      alignItems='center'
      width='100%'
      maxWidth={1280}
      minHeight='100vh'
      mx={'auto'}
      px={[2, 4, 5]}
      my={5}
    >
      {title && (
        <Title mx='auto' mt={5} mb={4} level={1}>
          {title}
        </Title>
      )}
      {children}
    </Flex>
  );
};
