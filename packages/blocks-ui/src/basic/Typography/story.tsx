import { storiesOf } from '@storybook/react';
import * as React from 'react';
import * as Typography from './';
import { Provider } from '../Provider';

storiesOf('Typography', module).add('standard', () => {
  return (
    <Provider>
      <>
        <Typography.Display size={['large', 'small', 'medium']} mt={[2, 3, 4]}>
          Hey
        </Typography.Display>

        <Typography.Heading textAlign="center" size={'xsmall'} mt={4}>
          Hey there, how are you doing I hope it's all good
        </Typography.Heading>
      </>
    </Provider>
  );
});
