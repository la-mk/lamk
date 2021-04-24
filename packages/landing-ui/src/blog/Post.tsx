import { Box, MarkdownViewer, Provider } from '@la-mk/blocks-ui';
import React from 'react';
import { Post as PostType } from './Posts';
import { Timestamp } from './Timestamp';

export const Post = ({ post }: { post: PostType }) => {
  return (
    <Box my={6} mx={'auto'} p={5} maxWidth='56rem'>
      <Box mb={-6}>
        <Timestamp timestamp={post.date} />
      </Box>
      <Provider
      // theme={{
      //   lineHeights: {
      //     base: 1.66,
      //   },

      //   // space: {
      //   //   px: '1px',
      //   //   1: '0.5rem',
      //   //   2: '1rem',
      //   //   3: '1.5rem',
      //   //   4: '2rem',
      //   //   5: '2.5rem',
      //   //   6: '3rem',
      //   //   7: '4rem',
      //   //   8: '6rem',
      //   //   9: '10rem',
      //   // },

      //   fontSizes: {
      //     xs: '0.7rem',
      //     sm: '0.9rem',
      //     md: '1rem',
      //     lg: '1.3rem',
      //     xl: '1.4rem',
      //     '2xl': '1.5rem',
      //     '3xl': '1.9rem',
      //     '4xl': '2.3rem',
      //     '5xl': '2.9rem',
      //     '6xl': '3.8rem',
      //   },
      // }}
      >
        <MarkdownViewer>{post.body}</MarkdownViewer>
      </Provider>
    </Box>
  );
};
