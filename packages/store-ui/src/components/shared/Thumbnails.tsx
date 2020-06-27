import React from 'react';
import { Flex, Image, Box } from '@sradevski/blocks-ui';
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
            height='72px'
            width='72px'
            m={2}
          >
            <Box height={70}>
              <Image
                height={70}
                alt={`product-thumbnail-${index}`}
                style={{ cursor: 'pointer' }}
                onClick={() => onImageClick(imageId)}
                getSrc={params =>
                  sdk.artifact.getUrlForImage(imageId, imageBucket, params)
                }
              />
            </Box>
          </Flex>
        );
      })}
    </Flex>
  );
};
