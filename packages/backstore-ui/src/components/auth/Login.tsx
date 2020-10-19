import React from 'react';
import { LoginForm } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { useDispatch } from 'react-redux';
import { login, Credentials } from '../../state/modules/auth/auth.module';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import { useTranslation } from 'react-i18next';
import { AuthBase } from './AuthBase';

export const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleLogin = (data: Credentials) => {
    dispatch(login({ ...data, email: data.email?.toLowerCase() }, 'local'));
  };

  const authSchema = sdk.utils.schema.pick(sdk.user.schema, [
    'email',
    'password',
  ]);

  return (
    <AuthBase>
      <LoginForm
        schema={authSchema}
        logoUrl='/logo-horizontal.svg'
        login={handleLogin}
        onSignupNowClick={() => dispatch(goTo('/signup'))}
        onForgotPasswordClick={() => dispatch(goTo('/forgotPassword'))}
        getErrorMessage={(errorName, context) =>
          t(`errors.${errorName}`, context)
        }
      />
    </AuthBase>
  );
};
