import { Box, MarkdownViewer, Provider } from '@la-mk/blocks-ui';
import React from 'react';
import { Post as PostType } from './Posts';
import { Timestamp } from './Timestamp';

export const Post = ({ post }: { post: PostType }) => {
  return (
    <Box my={6} mx={'auto'} p={5} maxWidth='56rem'>
      <Timestamp timestamp={post.date} />
      <Provider
        theme={{
          lineHeights: {
            base: 1.66,
          },

          fontSizes: {
            xs: '0.8rem',
            sm: '0.9rem',
            md: '1.1rem',
            lg: '1.4rem',
            xl: '1.6rem',
            '2xl': '2rem',
            '3xl': '2.3rem',
            '4xl': '2.6rem',
            '5xl': '2.9rem',
            '6xl': '3.2rem',
          },
        }}
      >
        <MarkdownViewer>{post.body}</MarkdownViewer>
      </Provider>
    </Box>
  );
};
