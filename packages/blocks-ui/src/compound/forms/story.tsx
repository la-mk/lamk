import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Provider } from '../../basic/Provider';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { FormProps } from '../../basic/NewForm/NewForm';

const authSchema: FormProps<any>['schema'] = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
};

storiesOf('Forms', module)
  .add('Login form', () => (
    <Provider>
      <LoginForm
        schema={authSchema}
        login={() => null}
        onSignupNowClick={() => null}
        onForgotPasswordClick={() => null}
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
        schema={authSchema}
        logoUrl="/"
        signup={() => null}
        onLoginNowClick={() => null}
        getErrorMessage={(errorName: any, context: any) => {
          console.log(errorName, context);
          return '';
        }}
      />
    </Provider>
  ))
  .add('Password form', () => {
    const changePasswordSchema: FormProps<any>['schema'] = {
      type: 'object',
      additionalProperties: false,
      required: ['currentPassword', 'newPassword'],
      properties: {
        currentPassword: {
          type: 'string',
        },
        newPassword: {
          type: 'string',
        },
      },
    };

    return (
      <Provider>
        <ChangePasswordForm
          emphasized
          schema={changePasswordSchema}
          onSubmit={() => console.log('Form completed')}
          getErrorMessage={(errorName: any, context: any) => {
            console.log(errorName, context);
            return '';
          }}
        />
      </Provider>
    );
  })
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
