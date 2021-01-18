import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Markdown } from './';
import { Provider } from '../../';

storiesOf('Markdown', module).add('standard', () => {
  const test = `
  ### This is a test
  _______

  Hey there
  `;

  return (
    <Provider>
      <div>
        <Markdown>{test}</Markdown>
      </div>
    </Provider>
  );
});
