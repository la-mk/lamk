import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Result } from '.';
import { Provider } from '../..';

storiesOf('Result', module).add('standard', () => (
  <Provider>
    <div>
      <Result
        status="empty"
        title="No data"
        description="There is no data found"
      />
      <Result
        status="success"
        mt={7}
        title="success"
        description="This is a description"
      />
      <Result
        status="warning"
        mt={7}
        title="warning"
        description="This is a description"
      />
      <Result
        status="error"
        mt={7}
        title="error"
        description="This is a description"
      />
      <Result
        status="404"
        mt={7}
        title="404"
        description="This is a description"
      />
      <Result
        status="500"
        mt={7}
        title="500"
        description="This is a description"
      />
    </div>
  </Provider>
));
