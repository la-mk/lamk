import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Provider } from '../../basic/Provider';
import { LoginForm } from './';

storiesOf('Login Form', module).add('basic', () => (
  <Provider>
         <LoginForm
            login={() => null}
            onSignupNowClick={() => null}
            validate={() => null}
            validateSingle={() => null}
            getErrorMessage={(errorName: any, context: any) => {
              console.log(errorName, context);
              return '';
            }
            }
          />
  </Provider>
));
