import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { LanguagePicker } from './LanguagePicker';
import { Provider } from '../';
import { CookieBanner } from './CookieBanner';

storiesOf('Various', module)
  .add('standard', () => (
    <Provider>
      <div>
        <LanguagePicker languageCode="mk" onChangeLanguageCode={() => null} />
      </div>
    </Provider>
  ))
  .add('cookie banner', () => (
    <Provider>
      <div>
        <CookieBanner
          requests={[{ key: 'test', title: 'Test' }]}
          consents={null}
          onConsentsChanged={console.log}
          privacyPolicyLink="/test"
        />
      </div>
    </Provider>
  ));
