import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Provider } from '../../basic/Provider';
import { Box } from '../../basic/Box';
import { PickerBox, PickerBoxes } from './PickerBoxes';

storiesOf('PickerBoxes', module)
  .add('Color boxes picker', () => {
    const [selected, setSelected] = React.useState<string | number | undefined>(
      'green'
    );
    return (
      <Provider>
        <Box>
          <PickerBoxes
            values={['green', 'blue', 'yellow', 'white', 'black']}
            type="color"
            selected={selected}
            onSelect={setSelected}
          />
          <PickerBox value={selected} type="color" />
        </Box>
      </Provider>
    );
  })
  .add('Text boxes picker', () => {
    const [selected, setSelected] = React.useState<string | number | undefined>(
      'green'
    );
    const [size, setSize] = React.useState<string | number | undefined>(
      'S'
    );
    return (
      <Provider>
        <Box>
          <PickerBoxes
            values={['green', 'blue', 'yellow', 'white', 'black']}
            selected={selected}
            onSelect={setSelected}
          />
          <PickerBox value={selected} />

          <PickerBoxes
            values={['S', 'M', 'L', 'XL', 'XXL']}
            selected={size}
            onSelect={setSize}
          />
          <PickerBox value={size} />
        </Box>
      </Provider>
    );
  });
