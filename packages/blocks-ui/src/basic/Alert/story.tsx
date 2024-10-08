import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Alert } from './';
import { Provider } from '../../';

storiesOf('Alert', module).add('standard', () => (
  <Provider>
    <div>
      <Alert mt={5} status="info" message="Hey!">
        This is a description
      </Alert>

      <Alert mt={5} status="info" variant="subtle" message="Hey!">
        This is a description
      </Alert>

      <Alert mt={5} status="warning" message="Hey!">
        <strong>This is a react description</strong>
      </Alert>

      <Alert mt={5} status="info" message="Hey!" onClose={() => null}>
        This can be closed. This can be closed. This can be closed. This can be
        closed. This can be closed. This can be closed.
      </Alert>
    </div>
  </Provider>
));
