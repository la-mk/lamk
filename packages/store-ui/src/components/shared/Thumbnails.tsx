import React from 'react';
import { Flex, Image, Box } from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';

export interface ThumbnailsProps {
  images: string[];
  imageBucket: string;
  selectedImage: string;
  onImageClick: (imageId: string) => void;
}

export const Thumbnails = ({
  images,
  imageBucket,
  selectedImage,
  onImageClick,
}: ThumbnailsProps) => {
  return (
    <Flex direction='row' wrap='wrap' justify='center'>
      {images.map((imageId, index) => {
        return (
          <Flex
            key={imageId}
            // @ts-ignore
            style={
              selectedImage === imageId ? { border: '1px solid lightgray' } : {}
            }
            justify='center'
            align='center'
            height={'5rem'}
            width={'5rem'}
            m={2}
          >
            <Image
              height={70}
              alt={`product-thumbnail-${index}`}
              style={{ cursor: 'pointer' }}
              onClick={() => onImageClick(imageId)}
              getSrc={params =>
                sdk.artifact.getUrlForImage(imageId, imageBucket, params)
              }
            />
          </Flex>
        );
      })}
    </Flex>
  );
};
