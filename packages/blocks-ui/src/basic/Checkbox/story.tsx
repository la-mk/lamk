import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Checkbox, CheckboxGroup } from './';
import { Provider } from '../../';

storiesOf('Checkbox', module).add('standard', () => (
  <Provider>
    <>
      <div>
        <Checkbox size="sm">I'm a checkbox</Checkbox>
        <Checkbox ml={3}>Check me</Checkbox>
      </div>

      <CheckboxGroup value={['a', 'b']}>
        <div>
          <Checkbox size="sm" value="a">
            I'm a checkbox
          </Checkbox>
          <Checkbox ml={3} value="b">
            Check me
          </Checkbox>
        </div>
      </CheckboxGroup>
    </>
  </Provider>
));
