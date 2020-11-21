import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Provider } from './';
import { Button, Flex } from '../../';

const colors = [
  '#ffffff',
  '#11FFAC',
  '#123456',
  'maroon',
  '#276EF1',
  '#05944F',
  '#FFC043',
  '#E11900',
  '#000000',
];

storiesOf('Provider', module).add('standard', () => (
  <>
    {colors.map(color => {
      return (
        <Provider theme={{ colors: { primary: color } }}>
          <Flex my={2}>
            <Button mx={2}>Hey</Button>
            <Button variant="outline" mx={2}>
              Hey
            </Button>
            <Button variant="ghost" mx={2}>
              Hey
            </Button>
            <Button variant="link" mx={2}>
              Hey
            </Button>
          </Flex>
        </Provider>
      );
    })}
  </>
));
