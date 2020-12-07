import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Steps } from './';
import { Provider } from '../../';

storiesOf('Steps', module).add('standard', () => (
  <Provider>
    <div>
      <Steps
        orientation="vertical"
        steps={[
          {
            status: 'success',
            title: 'First',
            description: 'Awaiting delivery',
            key: 'first',
          },
          {
            status: 'success',
            title: 'Second',
            description: 'Awaiting shipment by courier',
            key: 'second',
          },
          {
            status: 'danger',
            title: 'Third',
            description: 'This failed',
            key: 'third',
          },

          {
            status: 'pending',
            title: 'Fourth',
            description: 'This is pending',
            key: 'fourth',
          },
        ]}
      />

      <Steps
        orientation="horizontal"
        steps={[
          {
            status: 'success',
            title: 'First',
            description: 'Awaiting delivery',
            key: 'first',
          },
          {
            status: 'success',
            title: 'Second',
            description: 'Awaiting shipment by courier',
            key: 'second',
          },
          {
            status: 'danger',
            title: 'Third',
            description: 'This failed',
            key: 'third',
          },

          {
            status: 'pending',
            title: 'Fourth',
            description: 'This is pending',
            key: 'fourth',
          },
        ]}
      />
    </div>
  </Provider>
));
