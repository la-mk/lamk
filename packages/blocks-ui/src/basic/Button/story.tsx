import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Button, ButtonGroup } from './';
import { Provider } from '../../';
import { Plus } from 'react-feather';

storiesOf('Button', module).add('standard', () => (
  <Provider>
    <div>
      <Button size="sm">Button</Button>
      <Button mx={2} isDanger>
        Danger button
      </Button>

      <ButtonGroup variant="outline" size="sm">
        <Button>Some button</Button>
        <Button>Some button</Button>
        <Button>Some button</Button>
      </ButtonGroup>

      <Button
        mx={2}
        variant="ghost"
        aria-label="Test"
        leftIcon={<Plus />}
        onClick={() => null}
      />
    </div>
  </Provider>
));
