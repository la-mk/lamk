import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Badge } from '../Badge';
import { Provider } from '../../';
import { CheckCircle, ShoppingCart } from 'react-feather';
import { Positioner } from '.';
import { Box } from '../Box';

storiesOf('Positioner', module).add('standard', () => (
  <Provider>
    <>
      <Positioner overlayContent={<CheckCircle color="green" size={20} />}>
        <Box width="200px" height="100px" bg="lightgray" />
      </Positioner>
      <Positioner
        overlayContent={
          <Badge
            // @ts-ignore
            colorScheme="green"
            variant="solid"
            borderRadius="full"
            size="sm"
            py={'2px'}
          >
            110
          </Badge>
        }
      >
        <ShoppingCart size={20} />
      </Positioner>
    </>
  </Provider>
));
