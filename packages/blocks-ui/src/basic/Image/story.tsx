import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Image } from './Image';
import { Provider } from '../Provider';
import { Text } from '../Typography';
import { Flex } from '../Flex';

storiesOf('Image', module).add('standard', () => (
  <Provider>
    <>
      <Flex flexDirection="column">
        <Text>No image found</Text>
        <Image src={'https://via.placeholder-nonexistent.com/80x160'} />
      </Flex>

      <Flex flexDirection="column">
        <Text>Src is null</Text>
        <Image getSrc={() => null} />
      </Flex>

      <Flex flexDirection="column">
        <Text>Image Sizing</Text>
        <Image getSrc={() => 'https://via.placeholder.com/160x80'} />
        <Image getSrc={() => 'https://via.placeholder.com/80x160'} />
      </Flex>
    </>
  </Provider>
));
