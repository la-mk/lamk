import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Accordion } from './';
import { Provider } from '../../';

storiesOf('Accordion', module).add('standard', () => (
  <Provider>
    <div>
      <Accordion
        items={[
          { title: 'First item', content: 'This is my content' },
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
          },
        ]}
      />
    </div>
  </Provider>
));
