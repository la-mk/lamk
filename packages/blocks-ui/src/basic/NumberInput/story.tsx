import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { NumberInput } from '.';
import { Provider } from '../..';

storiesOf('NumberInput', module).add('standard', () => {
  const [val, setVal] = React.useState<number | undefined>();
  return (
    <Provider>
      <div>
        <NumberInput
          value={val}
          onChange={(_val, newVal) => setVal(newVal)}
          prefix="$"
          suffix="ден"
          size="sm"
        />
      </div>
    </Provider>
  );
});
