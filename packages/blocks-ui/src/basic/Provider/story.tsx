import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Provider } from '.';
import { Button, Display, Heading } from '../../';
import { getBrandTheme } from '../../theme';

storiesOf('Provider', module).add('standard', () => {
  return (
    <Provider baseTheme={getBrandTheme('#11FFAC')}>
      <div>
        <Display size={['large', 'small', 'medium']} mt={[2, 3, 4]}>
          Hey
        </Display>

        <Heading size={'xsmall'} mt={4}>
          Hey there, how are you doing I hope it's all good
        </Heading>

        <Button>Hey there</Button>
      </div>
    </Provider>
  );
});
