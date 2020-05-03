import { default as NextHead } from 'next/head';
import { HeadElements } from '@sradevski/blocks-ui';
import { HeadElementsProps } from '@sradevski/blocks-ui/dist/compound/HeadElements';
import React from 'react';

// Check opengraph for more details on the og: tags.
export const Head = (props: Omit<HeadElementsProps, 'HeadComponent'>) => {
  return <HeadElements {...props} HeadComponent={NextHead} />;
};
