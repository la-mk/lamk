import React from 'react';
import { Flex, Title } from '@lamk/blocks-ui';

interface PageProps {
  title?: string;
  children: React.ReactNode;
}

export const Page = ({ title, children }: PageProps) => {
  return (
    <Flex
      flexDirection='column'
      justifyContent='flex-start'
      width='100%'
      px={[3, 3, 5, 5]}
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
