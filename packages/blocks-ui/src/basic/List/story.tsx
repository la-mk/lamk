import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { List } from './';
import { Provider } from '../../';

const exampleData = [
  {
    content: 'First item',
  },
  {
    content: 'Second item',
  },
  {
    content: 'Third item',
  },
];

storiesOf('List', module).add('standard', () => {
  return (
    <Provider>
      <div>
        <List variant="unordered" items={exampleData} />
        <List variant="ordered" items={exampleData} />
      </div>
    </Provider>
  );
});
