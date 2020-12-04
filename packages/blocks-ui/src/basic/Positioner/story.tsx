import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Badge } from '../Badge';
import { Provider } from '../../';
import { CheckCircleFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { Positioner } from '.';
import { Box } from '../Box';

storiesOf('Badge', module).add('standard', () => (
  <Provider>
    <>
      <Positioner
        overlayContent={
          <CheckCircleFilled
            style={{
              color: 'green',
              fontSize: 20,
            }}
          />
        }
      >
        <Box width="200px" height="100px" bg="lightgray" />
      </Positioner>
      <Positioner
        overlayContent={
          <Badge
            colorScheme="green"
            variant="solid"
            borderRadius="full"
            size="xs"
          >
            0
          </Badge>
        }
      >
        <ShoppingCartOutlined style={{ fontSize: 20 }} />
      </Positioner>
    </>
  </Provider>
));
