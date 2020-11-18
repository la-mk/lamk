import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Provider } from '.';
import { Button } from '../../';
import { getBrandTheme } from '../../theme';

storiesOf('Provider', module).add('standard', () => {
  const colors = [
    '#ffffff',
    '#11FFAC',
    '#123456',
    'maroon',
    '#276EF1',
    '#05944F',
    '#FFC043',
    '#E11900',
    '#000000',
  ];

  return (
    <>
      {colors.map(color => (
        <Provider baseTheme={getBrandTheme(color)}>
          <div>
            <Button>Hey there</Button>

            <Button kind="secondary" ml={3}>
              Hi.
            </Button>

            <Button kind="tertiary" ml={3}>
              How are you?
            </Button>

            <Button disabled kind="tertiary" ml={3}>
              How are you?
            </Button>
          </div>
        </Provider>
      ))}
    </>
  );
});
