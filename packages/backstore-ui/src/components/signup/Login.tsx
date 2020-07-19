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

  return (
    <AuthBase>
      <LoginForm
        // logoUrl='/logo-horizontal.svg'
        login={handleLogin}
        validate={(data: Credentials) => sdk.user.validate(data as any, true)}
        validateSingle={sdk.user.validateSingle}
        getErrorMessage={(errorName, context) =>
          t(`errors.${errorName}`, context)
        }
        onSignupNowClick={() => dispatch(goTo('/signup'))}
      />
    </AuthBase>
  );
};
