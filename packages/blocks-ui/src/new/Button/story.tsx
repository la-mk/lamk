import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Button } from '.';
import { Provider } from '../Provider';

storiesOf('New/Button', module).add('standard', () => {
  return (
    <Provider>
      <>
        <Button mt={[2, 3, 4]}>Hey</Button>
      </>
    </Provider>
  );
});
