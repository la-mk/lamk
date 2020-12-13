import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Treeview } from './';
import { Provider } from '../../';

// interface TreeviewEntry {
//   title: string;
//   key: string;
//   isSelectable?: boolean;
//   children?: TreeviewEntry[];

storiesOf('Treeview', module).add('standard', () => {
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <Provider>
      <div>
        <Treeview
          selected={selected}
          onSelect={setSelected}
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
                      title: 'Nested again item',
                      key: 'nested-again',
                    },
                    {
                      title: 'Nested again 2 item',
                      key: 'nested-again2',
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
        />
      </div>
    </Provider>
  );
});
