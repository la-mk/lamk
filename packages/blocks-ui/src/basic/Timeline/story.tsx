import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Timeline } from './';
import { Provider } from '../../';

storiesOf('Timeline', module).add('standard', () => (
  <Provider>
    <div>
      <Timeline
        events={[
          {
            status: 'test',
            description:
              'This is a test description that is longer than expected, it should be handled well',
            timestamp: new Date().toISOString(),
          },
          {
            status: 'test',
            description: 'This is a test description',
            timestamp: new Date().toISOString(),
          },
          {
            status: 'test',
            description: 'This is a test description',
            timestamp: new Date().toISOString(),
          },
          {
            status: 'test',
            description: 'This is a test description',
            timestamp: new Date().toISOString(),
          },
        ]}
      />
    </div>
  </Provider>
));
