import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Provider } from '../../basic/Provider';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { UserForm } from './UserForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { Box } from '../../basic/Box';

storiesOf('Forms', module)
  .add('Login form', () => (
    <Provider>
      <LoginForm
        login={() => null}
        onSignupNowClick={() => null}
        validate={() => null}
        validateSingle={() => null}
        getErrorMessage={(errorName: any, context: any) => {
          console.log(errorName, context);
          return '';
        }}
      />
    </Provider>
  ))
  .add('Signup form', () => (
    <Provider>
      <SignupForm
        logoUrl="/"
        signup={() => null}
        onLoginNowClick={() => null}
        validate={() => null}
        validateSingle={() => null}
        getErrorMessage={(errorName: any, context: any) => {
          console.log(errorName, context);
          return '';
        }}
      />
    </Provider>
  ))
  .add('Password form', () => (
    <Provider>
      <Box width="600px">
        <ChangePasswordForm
          size="large"
          onFormCompleted={() => console.log('Form completed')}
          validate={() => null}
          validateSingle={() => null}
          getErrorMessage={(errorName: any, context: any) => {
            console.log(errorName, context);
            return '';
          }}
        />
      </Box>
    </Provider>
  ))
  .add('User form', () => (
    <Provider>
      <Box width="600px">
        <UserForm
          size="large"
          onFormCompleted={() => console.log('Form completed')}
          validate={() => null}
          validateSingle={() => null}
          getErrorMessage={(errorName: any, context: any) => {
            console.log(errorName, context);
            return '';
          }}
        />
      </Box>
    </Provider>
  ));
