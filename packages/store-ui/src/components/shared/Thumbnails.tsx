import React from 'react';
import { Flex } from '@sradevski/blocks-ui';
import { NewImage } from './NewImage';
import { sdk } from '@sradevski/la-sdk';

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
    <Flex flexDirection='row' flexWrap='wrap' justifyContent='center'>
      {images.map((imageId, index) => {
        return (
          <Flex
            key={imageId}
            style={
              selectedImage === imageId ? { border: '1px solid lightgray' } : {}
            }
            justifyContent='center'
            alignItems='center'
            width='72px'
            height='72px'
            m={2}
          >
            <NewImage
              height={72}
              alt={`product-thumbnail-${index}`}
              style={{ cursor: 'pointer' }}
              onClick={() => onImageClick(imageId)}
              imageId={imageId}
              imageBucket={imageBucket}
              getFullPath={sdk.artifact.getUrlForImage}
            />
          </Flex>
        );
      })}
    </Flex>
  );
};
