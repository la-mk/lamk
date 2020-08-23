import React from 'react';
import { Paragraph, Box, Title } from '@sradevski/blocks-ui';

export const Legal = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <Box maxWidth={960} mx={'auto'} px={[3, 4, 4]} my={5}>
      <Title textAlign='center' fontSize={[5, 5, 6]} level={1}>
        {title}
      </Title>
      <Paragraph textAlign='justify' style={{ whiteSpace: 'pre-wrap' }}>
        {content}
      </Paragraph>
    </Box>
  );
};
