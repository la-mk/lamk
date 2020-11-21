import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { LanguagePicker } from './LanguagePicker';
import { Provider } from '../';

storiesOf('Various', module).add('standard', () => (
  <Provider>
    <div>
      <LanguagePicker languageCode="mk" onChangeLanguageCode={() => null} />
    </div>
  </Provider>
));
