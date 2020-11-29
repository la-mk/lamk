import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Modal } from './';
import { Provider } from '../../';

storiesOf('Modal', module).add('standard', () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Provider>
      <div>
        <button onClick={() => setIsOpen(true)}>Open</button>
        <Modal
          maxWidth={['100%', '80%', '60%']}
          header="Title"
          footer={
            <>
              <button
                style={{ marginRight: 8 }}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button onClick={() => setIsOpen(false)}>Save</button>
            </>
          }
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          size="lg"
        >
          <div style={{ width: '80%' }}>I am inside the modal body!</div>
        </Modal>
      </div>
    </Provider>
  );
});
