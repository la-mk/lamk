import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ColorPicker } from './';
import { Provider } from '../../';

storiesOf('ColorPicker', module).add('standard', () => {
  const [color, setColor] = React.useState('#000000');
  return (
    <Provider>
      <div>
        <ColorPicker value={color} onChange={setColor} />
      </div>
    </Provider>
  );
});
