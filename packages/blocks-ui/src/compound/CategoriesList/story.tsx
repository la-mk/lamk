import range from 'lodash/range';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { CategoriesList } from './';
import { Provider } from '../../';
import random from 'lodash/random';

storiesOf('CategoriesList', module).add('standard', () => {
  return (
    <Provider>
      <div>
        <CategoriesList
          trigger={({ toggle, close, open }) => (
            <button onClick={toggle} onMouseEnter={open} onMouseLeave={close}>
              Toggle
            </button>
          )}
          getHref={() => ''}
          items={range(0, 8).map(i => ({
            title: 'First item',
            key: `first${i}`,

            children: range(0, random(6, 10)).map(j => ({
              title: 'Nested item',
              key: `nested${j}`,
            })),
          }))}
        />
      </div>
    </Provider>
  );
});
