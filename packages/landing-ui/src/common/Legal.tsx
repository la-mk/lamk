import React from 'react';
import { Text, Box, Heading } from '@sradevski/blocks-ui';

export const Legal = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <Box maxWidth={960} mx={'auto'} px={[3, 4, 4]} my={5}>
      <Heading align='center' as='h1' size='2xl'>
        {title}
      </Heading>
      <Text align='justify' color='text.dark' as='p' whiteSpace='pre-wrap'>
        {content}
      </Text>
    </Box>
  );
};
