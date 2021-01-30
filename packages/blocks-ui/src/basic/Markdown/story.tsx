import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { MarkdownViewer } from './MarkdownViewer';
import { Provider } from '../../';
import { MarkdownEditor } from './MarkdownEditor';

const exampleMd = `
# First title
## Second title
### Third title
#### Fourth title
_______

**bold text**
*italicized text*
<br>
> blockquote
<br>
1. First item
2. Second item
3. Third item

- First item
- Second item
- Third item

\`code\`

<a href="/test">Some html</a>

[Duck Duck Go](https://duckduckgo.com)


<fake@example.com>

![alt text for image](https://picsum.photos/300/300)
![alt text for video  ](https://www.youtube.com/embed/Hsd5k8mWdV0)

Hey there


`;

storiesOf('Markdown', module)
  .add('standard', () => {
    return (
      <Provider>
        <div>
          <MarkdownViewer titleLevelOffset={1}>{exampleMd}</MarkdownViewer>
        </div>
      </Provider>
    );
  })
  .add('editor', () => {
    const [value, setValue] = React.useState<any[]>([]);

    return (
      <Provider>
        <MarkdownEditor
          height={'30rem'}
          initialValue={exampleMd}
          value={value}
          onChange={setValue}
          onBlur={console.log}
        />
      </Provider>
    );
  });
