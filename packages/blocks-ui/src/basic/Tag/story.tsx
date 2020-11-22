import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Tag } from './';
import { Provider } from '../../';

storiesOf('Tag', module).add('standard', () => (
  <Provider>
    <div>
      <Tag mx={2}>I am tag</Tag>
      <Tag mx={2} size="xs">
        I am tag
      </Tag>
      <Tag mx={2} size="lg" colorScheme="primary">
        I am custom color tag
      </Tag>
    </div>
  </Provider>
));
