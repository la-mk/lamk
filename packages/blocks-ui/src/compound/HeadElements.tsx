import React from 'react';

export interface HeadElementsProps {
  title: string;
  description: string;
  siteName?: string;
  previewImages?: string[];
}

// Check opengraph for more details on the og: tags.
export const HeadElements = ({
  siteName,
  title,
  description,
  previewImages,
}: HeadElementsProps) => {
  return (
    <>
      <title key='title'>{siteName ? `${title} | ${siteName}` : title}</title>
      <meta property='og:title' content={title} />
      <meta name='twitter:title' content={title} />

      <meta key='description' name='description' content={description} />
      <meta property='og:description' content={description} />
      <meta name='twitter:description' content={description} />

      {previewImages &&
        previewImages.map(image => (
          <meta key={image} property='og:image' content={image} />
        ))}

      <meta charSet='utf-8' />
      <meta
        key='viewport'
        name='viewport'
        content='initial-scale=1.0, width=device-width'
      />
    </>
  );
};
