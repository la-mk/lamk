import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Image } from './Image';
import { Provider } from '../Provider';
import { Text } from '../Typography';
import { Flex } from '../Flex';
import { Spin } from '../Spin';

storiesOf('Image', module).add('standard', () => (
  <Provider>
    <>
      <Flex flexDirection='column'>
        <Text>Fallback image</Text>
        <Image src={['this-wont-load', 'https://via.placeholder.com/100']} />
      </Flex>
      <Flex flexDirection='column'>
        <Text>No image found</Text>
        <Image
          width='90px'
          height='90px'
          loader={<Spin />}
          src={'https://httpstat.us/400?sleep=2000'}
        />
      </Flex>
      <Flex flexDirection='column'>
        <Text>Image Sizing</Text>
        <Image
          maxWidth='80px'
          maxHeight='80px'
          m={2}
          src={['https://via.placeholder.com/160x80']}
        />
        <Image
          maxWidth='80px'
          maxHeight='80px'
          m={2}
          src={['https://via.placeholder.com/80x160']}
        />
      </Flex>
    </>
  </Provider>
));
