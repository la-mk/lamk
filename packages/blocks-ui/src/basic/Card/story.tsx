import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Card } from './';
import { Divider, Provider } from '../../';

storiesOf('Card', module).add('standard', () => (
  <Provider>
    <div>
      <Card>
        Hey there
        <Divider my={3} />
      </Card>
    </div>
  </Provider>
));
