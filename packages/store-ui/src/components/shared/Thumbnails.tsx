import React from 'react';
import { SizedImage, Flex } from '@lamk/blocks-ui';

export interface ThumbnailsProps {
  images: string[];
  selectedImage: string;
  onImageClick: (imageUrl: string) => void;
}

export const Thumbnails = ({
  images,
  selectedImage,
  onImageClick,
}: ThumbnailsProps) => {
  return (
    <Flex flexDirection='row' flexWrap='wrap' justifyContent='center'>
      {images.map(imageUrl => {
        return (
          <Flex
            key={imageUrl}
            style={
              selectedImage === imageUrl
                ? { border: '1px solid lightgray' }
                : {}
            }
            justifyContent='center'
            alignItems='center'
            width='72px'
            height='72px'
            m={2}
          >
            <SizedImage
              onClick={() => onImageClick(imageUrl)}
              height='62px'
              style={{ maxWidth: '62px', cursor: 'pointer' }}
              src={imageUrl}
            />
          </Flex>
        );
      })}
    </Flex>
  );
};
