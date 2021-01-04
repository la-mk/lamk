import { default as NextHead } from 'next/head';
import { HeadElements } from '@la-mk/blocks-ui';
import { HeadElementsProps } from '@la-mk/blocks-ui/dist/compound/HeadElements';
import React from 'react';

export const Head = (props: Omit<HeadElementsProps, 'HeadComponent'>) => {
  return <HeadElements {...props} HeadComponent={NextHead} />;
};
