import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Radio } from './';
import { Provider } from '../../';

storiesOf('Radio', module).add('standard', () => {
  const [selected, setSelected] = React.useState<any>('first');
  return (
    <Provider>
      <div>
        <Radio
          value={selected}
          onChange={setSelected}
          options={[
            { children: 'First', value: 'first' },
            { children: 'Second', value: 'second' },
            { children: 'Third', value: 'third' },
          ]}
          size="sm"
        />

        <Radio
          ml={3}
          value={selected}
          onChange={setSelected}
          options={[
            { children: 'First', value: 'first' },
            { children: 'Second', value: 'second' },
            { children: 'Third', value: 'third' },
          ]}
          size="lg"
          variant="button"
        />
      </div>
    </Provider>
  );
});
