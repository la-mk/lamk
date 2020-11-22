import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { FooterContent } from './';
import { Provider } from '../../';

storiesOf('FooterContent', module).add('standard', () => (
  <Provider>
    <div style={{ padding: 20, backgroundColor: 'black', color: 'white' }}>
      <FooterContent
        Link={(props: any) => <a {...props} />}
        menus={[
          {
            text: 'Hey',
            submenus: [
              { link: '#', text: 'Hey there' },
              { link: '#', text: 'How are you?' },
            ],
          },

          {
            text: 'There',
            submenus: [
              { link: '#', text: 'Hey you' },
              { link: '#', text: 'I am fine?' },
            ],
          },
        ]}
      />
    </div>
  </Provider>
));
