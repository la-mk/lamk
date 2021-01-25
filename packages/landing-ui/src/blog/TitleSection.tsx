import { Box, Heading, Text } from '@la-mk/blocks-ui';
import React from 'react';
import { Post } from './Posts';
import { Timestamp } from './Timestamp';

export const TitleSection = ({ post }: { post: Post }) => {
  return (
    <Box>
      <Timestamp timestamp={post.date} />
      <Heading color='secondary' mt={1} size={'lg'} as={'h2'}>
        {post.title}
      </Heading>

      <Text noOfLines={4} mt={2} as='p'>
        {post.summary}
      </Text>
    </Box>
  );
};
