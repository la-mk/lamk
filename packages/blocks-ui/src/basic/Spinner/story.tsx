import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Spinner } from './';
import { Provider } from '../../';

storiesOf('Spinner', module).add('standard', () => (
  <Provider>
    <div>
      <Spinner mt={4} size="sm" />
      <Spinner mt={4} size="lg" label="Spinning..." />
      <Spinner mt={4} size="lg" label="Spinning..." isLoaded={false}>
        <div
          style={{ backgroundColor: 'lightgray', height: 80, width: '100%' }}
        >
          I am a child, still loading...
        </div>
      </Spinner>
    </div>
  </Provider>
));
