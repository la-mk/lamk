import { default as NextHead } from 'next/head';
import React from 'react';

interface HeadProps {
  title: string;
}

export const Head = ({ title }) => {
  return (
    <NextHead>
      <title key='title'>{title}</title>
      <meta
        key='viewport'
        name='viewport'
        content='initial-scale=1.0, width=device-width'
      />
    </NextHead>
  );
};
