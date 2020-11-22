import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Drawer } from './';
import { Provider } from '../../';

storiesOf('Drawer', module).add('standard', () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Provider>
      <div>
        <button onClick={() => setIsOpen(true)}>Open</button>
        <Drawer
          title="Drawer"
          size="xs"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <button>Inside the drawer</button>
        </Drawer>
      </div>
    </Provider>
  );
});
