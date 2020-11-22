import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Tabs } from './';
import { Provider } from '../..';

storiesOf('Tabs', module).add('standard', () => {
  const [items, setItems] = React.useState([
    {
      title: 'First item',
      content: 'This is my content',
      isClosable: true,
    },
    {
      title: 'Second item',
      content: (
        <div
          style={{
            height: 60,
            width: '100%',
            backgroundColor: 'lightgray',
          }}
        >
          This is also content inside a div
        </div>
      ),
      isClosable: true,
    },
  ]);
  return (
    <Provider>
      <div>
        <Tabs
          onAdd={() =>
            setItems(x => [
              ...x,
              { title: 'New one!', content: 'Hoo', isClosable: true },
            ])
          }
          onRemove={idx =>
            setItems(x => [...x.slice(0, idx), ...x.slice(idx + 1)])
          }
          isExpandable={true}
          items={items}
        />
      </div>
    </Provider>
  );
});
