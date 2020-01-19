import { default as NextHead } from 'next/head';
import React from 'react';

interface HeadProps {
  title: string;
  previewImages?: string[];
}

// Check opengraph for more details on the og: tags.
export const Head = ({ title, previewImages }: HeadProps) => {
  return (
    <NextHead>
      <title key='title'>{title}</title>
      <meta
        key='viewport'
        name='viewport'
        content='initial-scale=1.0, width=device-width'
      />
      <meta property='og:title' content={title} />
      {previewImages &&
        previewImages.map(image => (
          <meta key={image} property='og:image' content={image} />
        ))}
    </NextHead>
  );
};
