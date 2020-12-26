import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Cascader } from './';
import { Provider } from '../../';

storiesOf('Cascader', module).add('standard', () => {
  const [selected, setSelected] = React.useState<any>();
  return (
    <Provider>
      <div>
        <Cascader
          value={selected}
          onChange={setSelected}
          items={[
            {
              title: 'First item',
              key: 'first',

              children: [
                {
                  title: 'Nested item',
                  key: 'nested',

                  children: [
                    {
                      title: 'again item',
                      key: 'nested-again',
                    },
                    {
                      title: 'Nested again 2 item',
                      key: 'nested-again2',
                    },
                  ],
                },
                {
                  title: 'Nested 2 item',
                  key: 'nested-2',

                  children: [
                    {
                      title: 'This item',
                      key: 'nested-this-again',
                    },
                    {
                      title: 'Nested again 2 item',
                      key: 'nested-this-again2',
                    },
                  ],
                },
              ],
            },
            {
              title: 'Second item',
              key: 'second',

              children: [
                {
                  title: 'Second nested item',
                  key: 'second-nested',

                  children: [
                    {
                      title: 'Second Nested again item',
                      key: 'second-nested-again',
                    },
                  ],
                },
                {
                  title: 'Second nested item 2',
                  key: 'second-nested-2',

                  children: [
                    {
                      title: 'Second Nested again item 2',
                      key: 'second-nested-again-2',
                    },
                  ],
                },
              ],
            },
          ]}
        ></Cascader>
      </div>
    </Provider>
  );
});
