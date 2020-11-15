import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Provider } from '../Provider';
import { Box } from '../Box';
import { PickerBox, PickerBoxes } from '.';

storiesOf('PickerBoxes', module)
  .add('Color boxes picker', () => {
    const [selected, setSelected] = React.useState<string | undefined>('green');
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

          <PickerBoxes
            size={'compact'}
            values={['green', 'blue', 'yellow', 'white', 'black']}
            type="color"
            selected={selected}
            onSelect={setSelected}
          />
          <PickerBox size={'compact'} value={selected} type="color" />
        </Box>
      </Provider>
    );
  })
  .add('Text boxes picker', () => {
    const [selected, setSelected] = React.useState<string | undefined>('green');
    const [size, setSize] = React.useState<string | undefined>('S');
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
          <PickerBox highlight={true} value={size} />

          <PickerBoxes
            size={'compact'}
            values={['green', 'blue', 'yellow', 'white', 'black']}
            selected={selected}
            onSelect={setSelected}
          />
          <PickerBox size={'compact'} value={selected} />
        </Box>
      </Provider>
    );
  })
  .add('Disabled boxes picker', () => {
    const [selected, setSelected] = React.useState<string | undefined>('green');
    return (
      <Provider>
        <Box>
          <PickerBoxes
            values={['green', 'blue', 'yellow', 'white', 'black']}
            disabled={['green', 'yellow']}
            type="color"
            selected={selected}
            onSelect={setSelected}
          />
          <PickerBoxes
            values={['green', 'blue', 'yellow', 'white', 'black']}
            disabled={['green', 'yellow']}
            type="text"
            selected={selected}
            onSelect={setSelected}
          />
        </Box>
      </Provider>
    );
  });
