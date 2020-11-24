import React from 'react';
import { Text, Button, SignupForm } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { useDispatch } from 'react-redux';
import { signup, Credentials } from '../../state/modules/auth/auth.module';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import { useTranslation } from 'react-i18next';
import { env } from '../../common/env';
import { AuthBase } from './AuthBase';

export const Signup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleSignup = (data: Credentials) => {
    dispatch(signup({ ...data, email: data.email?.toLowerCase() }, 'local'));
  };

  const authSchema = sdk.utils.schema.pick(sdk.user.schema, [
    'email',
    'password',
  ]);

  return (
    <AuthBase>
      {!env.ENABLE_SIGNUP && (
        <Text mb={6} color='secondary'>
          {t('auth.signupClosedBeta')}
        </Text>
      )}
      {!env.ENABLE_SIGNUP && (
        <Button onClick={() => dispatch(goTo('/login'))}>
          {t('auth.login')}
        </Button>
      )}

      {env.ENABLE_SIGNUP && (
        <SignupForm
          schema={authSchema}
          logoUrl='/logo-horizontal.svg'
          signup={handleSignup}
          onLoginNowClick={() => dispatch(goTo('/login'))}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        />
      )}
    </AuthBase>
  );
};
