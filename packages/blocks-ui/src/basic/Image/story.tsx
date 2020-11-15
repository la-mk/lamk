import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Image } from './Image';
import { Provider } from '../Provider';
import { Label } from '../Typography';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { ImageMagnifier } from './ImageMagnifier';

storiesOf('Image', module).add('standard', () => (
  <Provider>
    <>
      <Flex width={400} flexDirection="column">
        <Label>No image found</Label>
        <Image src={'https://via.placeholder-nonexistent.com/80x160'} />
      </Flex>

      <Flex width={400} flexDirection="column">
        <Label>Src is null</Label>
        <Image getSrc={() => null} />
      </Flex>

      <Flex flexDirection="column">
        <Label>Image Sizing</Label>
        <Box height={80} minWidth={180}>
          <Image getSrc={() => 'https://via.placeholder.com/160x80'} />
        </Box>

        <Box height={160}>
          <Image getSrc={() => 'https://via.placeholder.com/80x160'} />
        </Box>
      </Flex>

      <Flex flexDirection="column" height="100%" width="fit-content">
        <Label>Image Magnifier</Label>

        <Box height={400}>
          <ImageMagnifier src={'https://via.placeholder.com/400x400'}>
            {imageProps => (
              <Image
                getSrc={() => 'https://via.placeholder.com/400x400'}
                {...imageProps}
              />
            )}
          </ImageMagnifier>
        </Box>

        <Box height={400}>
          <ImageMagnifier src={'https://via.placeholder.com/200x400'}>
            {imageProps => (
              <Image
                getSrc={() => 'https://via.placeholder.com/200x400'}
                {...imageProps}
              />
            )}
          </ImageMagnifier>
        </Box>

        <Box height={200}>
          <ImageMagnifier src={'https://via.placeholder.com/400x200'}>
            {imageProps => (
              <Image
                getSrc={() => 'https://via.placeholder.com/400x200'}
                {...imageProps}
              />
            )}
          </ImageMagnifier>
        </Box>
      </Flex>
    </>
  </Provider>
));
