import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Avatar } from './';
import { Provider } from '../../';

storiesOf('Avatar', module).add('standard', () => (
  <Provider>
    <div>
      <Avatar size="xs" />
      <Avatar name="John Doe" />
      <Avatar size="lg" src="https://picsum.photos/120/120" />
    </div>
  </Provider>
));
