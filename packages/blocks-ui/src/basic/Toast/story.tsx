import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { toast } from './';
import { Provider } from '../../';

const Toast = () => {
  return <button onClick={() => toast.success('Hey!')}>Click me</button>;
};

storiesOf('Toast', module).add('standard', () => (
  <Provider>
    <div>
      <Toast />
    </div>
  </Provider>
));
