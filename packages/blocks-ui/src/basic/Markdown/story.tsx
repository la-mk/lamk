import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Markdown } from './';
import { Provider } from '../../';

storiesOf('Markdown', module).add('standard', () => {
  const test = `
  # First title
  ## Second title
  ### Third title
  #### Fourth title
  _______

  **bold text**

  *italicized text*
  > blockquote

  &nbsp;

  1. First item
  2. Second item
  3. Third item

  - First item
  - Second item
  - Third item


  \`code\`


  [Duck Duck Go](https://duckduckgo.com)


  <fake@example.com>
  
  ![alt text for image](https://picsum.photos/300/300)
  ![alt text for video  ](https://www.youtube.com/embed/Hsd5k8mWdV0)

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
