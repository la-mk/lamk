import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Provider } from '../../basic/Provider';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { UserForm } from './UserForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { Box } from '../../basic/Box';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { FormProps } from '../../basic/NewForm/NewForm';

storiesOf('Forms', module)
  .add('Login form', () => (
    <Provider>
      <LoginForm
        login={() => null}
        onSignupNowClick={() => null}
        onForgotPasswordClick={() => null}
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
  ))
  .add('Forgot password form', () => {
    const forgotPasswordSchema: FormProps<any>['schema'] = {
      type: 'object',
      additionalProperties: false,
      required: ['email'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
      },
    };

    return (
      <Provider>
        <>
          <ForgotPasswordForm
            schema={forgotPasswordSchema}
            onLoginInstead={() => null}
            onSubmit={() => console.log('Form completed')}
            getErrorMessage={(errorName, context) => {
              console.log(errorName, context);
              return '';
            }}
          />

          <ForgotPasswordForm
            schema={forgotPasswordSchema}
            hasSubmitted
            onLoginInstead={() => null}
            onSubmit={() => console.log('Form completed')}
            getErrorMessage={(errorName: any, context: any) => {
              console.log(errorName, context);
              return '';
            }}
          />
        </>
      </Provider>
    );
  })
  .add('Reset password form', () => {
    const resetPasswordSchema: FormProps<any>['schema'] = {
      type: 'object',
      additionalProperties: false,
      required: ['email'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
        password: {
          type: 'string',
          minLength: 8,
        },
      },
    };
    return (
      <Provider>
        <ResetPasswordForm<any>
          schema={resetPasswordSchema}
          onLoginInstead={() => null}
          onSubmit={() => console.log('Form completed')}
          getErrorMessage={(errorName: any, context: any) => {
            console.log(errorName, context);
            return '';
          }}
        />
      </Provider>
    );
  });
