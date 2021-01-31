import React from 'react';
import { Text, Box, Heading, MarkdownViewer } from '@la-mk/blocks-ui';

export const Legal = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <Box maxWidth={'60rem'} mx={'auto'} py={7} px={[4, 6, 7]}>
      <Heading align='center' as='h1' size='2xl' mb={7}>
        {title}
      </Heading>
      <MarkdownViewer titleLevelOffset={1}>{content}</MarkdownViewer>
    </Box>
  );
};
