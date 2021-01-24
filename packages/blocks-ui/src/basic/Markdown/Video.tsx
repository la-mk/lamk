import { Flex } from '../Flex';
import React from 'react';

export const Video = ({ src }: { src: string }) => {
  return (
    <Flex
      width="100%"
      // @ts-ignore
      position="relative"
      overflow="hidden"
      // Preserves the 16:9 aspect ratio
      pt="56.25%"
      align="center"
      justify="center"
      my={3}
    >
      <iframe
        style={{ position: 'absolute', top: 0, left: 0 }}
        height="100%"
        width="100%"
        src={src}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </Flex>
  );
};
