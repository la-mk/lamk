import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Button, ButtonGroup } from './';
import { Provider } from '../../';
import { AimOutlined } from '@ant-design/icons';

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
        leftIcon={<AimOutlined />}
        onClick={() => null}
      />
    </div>
  </Provider>
));
