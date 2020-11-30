import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Modal } from './';
import { Provider } from '../../';
import { Option, Select } from '../Select';

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
          <Select value={'option1'}>
            <Option value={'option1'}>Option 1</Option>
            <Option value={'option2'}>Option 2</Option>
            <Option value={'option3'}>Option 3</Option>
            <Option value={'option4'}>Option 4</Option>
          </Select>
        </Modal>
      </div>
    </Provider>
  );
});
