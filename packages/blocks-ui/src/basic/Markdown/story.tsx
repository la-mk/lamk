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

> blockquote

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

// const anotherExample = `
// # Hey there, this is the description for the store
// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ex turpis, blandit eget nisl vitae, convallis mattis lorem. Ut nisi sem, vehicula sit amet egestas sed, suscipit eget tortor. Nam eget nulla tellus. Mauris dignissim commodo mi, ac tincidunt dui vestibulum eu. Nullam semper turpis nec diam vehicula, et ornare metus venenatis. Cras eget urna maximus, laoreet lectus nec, consectetur enim. Vestibulum ultricies ac dolor non commodo. Quisque porta mattis congue. Quisque ornare sit amet massa sit amet aliquet. Morbi et enim orci. In condimentum pellentesque purus, at lacinia sem malesuada sed. Curabitur id odio at tellus vestibulum cursus id nec purus. Praesent sapien erat, elementum nec fermentum a, eleifend nec tellus. Nulla fringilla turpis et metus sodales, quis ultricies sapien facilisis. Proin eu ipsum tortor

// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ex turpis, blandit eget nisl vitae, convallis mattis lorem. Ut nisi sem, vehicula sit amet egestas sed, suscipit eget tortor. Nam eget nulla tellus. Mauris dignissim commodo mi, ac tincidunt dui vestibulum eu. Nullam semper turpis nec diam vehicula, et ornare metus venenatis. Cras eget urna maximus, laoreet lectus nec, consectetur enim. Vestibulum ultricies ac dolor non commodo. Quisque porta mattis congue. Quisque ornare sit amet.
// `;

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
    const [stringVal, setStringVal] = React.useState(exampleMd);
    const [value, setValue] = React.useState<any[]>([]);

    return (
      <Provider>
        <MarkdownEditor
          height={'30rem'}
          stringifiedValue={stringVal}
          value={value}
          onChange={setValue}
          onBlur={setStringVal}
        />
      </Provider>
    );
  });
