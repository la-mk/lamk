import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Set } from './Set';
import { Provider } from '../Provider';
import { Card } from '../Card';

const items = [
  {
    id: 1,
    name: 'First entry',
  },
  {
    id: 2,
    name: 'Second entry',
  },
  {
    id: 3,
    name: 'Third entry',
  },
  {
    id: 4,
    name: 'Fourth entry',
  },
  {
    id: 5,
    name: 'Fifth entry',
  },
  {
    id: 6,
    name: 'Sixth entry',
  },
  {
    id: 7,
    name: 'Seventh entry',
  },
];

storiesOf('Set', module).add('with text', () => (
  <Provider>
    <Set
      items={items}
      itemKey={'id'}
      renderItem={(item: any) => (
        <Card width={300} height={300}>
          {item.name}
        </Card>
      )}
    />
  </Provider>
));
