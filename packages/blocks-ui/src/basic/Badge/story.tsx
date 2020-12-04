import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Badge } from './';
import { Provider } from '../../';
// import { CheckCircleFilled } from '@ant-design/icons';

storiesOf('Badge', module).add('standard', () => (
  <Provider>
    <div>
      <Badge colorScheme="green" variant="solid" borderRadius="full" size="xs">
        0
      </Badge>
      {/* <Badge colorScheme="green" size="xs">
        <CheckCircleFilled
          style={{
            color: 'green',
            fontSize: 20,
          }}
        />
      </Badge> */}
    </div>
  </Provider>
));
