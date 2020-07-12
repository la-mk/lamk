import React from 'react';
import { Flex, Text, Button, SignupForm } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { useDispatch } from 'react-redux';
import { signup, Credentials } from '../../state/modules/auth/auth.module';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import { useTranslation } from 'react-i18next';
import env from '../../common/env';

export const Signup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleSignup = (data: Credentials) => {
    dispatch(signup({ ...data, email: data.email?.toLowerCase() }, 'local'));
  };

  return (
    <Flex flexDirection='column' alignItems='center' p={3}>
      {!env.ENABLE_SIGNUP && (
        <Text mb={6} color='secondary'>
          {t('auth.signupClosedBeta')}
        </Text>
      )}
      {!env.ENABLE_SIGNUP && (
        <Button type='primary' onClick={() => dispatch(goTo('/login'))}>
          {t('auth.login')}
        </Button>
      )}

      {env.ENABLE_SIGNUP && (
        <SignupForm
          // logoUrl='/logo-horizontal.svg'
          signup={handleSignup}
          validate={(data: Credentials) => sdk.user.validate(data as any, true)}
          validateSingle={sdk.user.validateSingle}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
          onLoginNowClick={() => dispatch(goTo('/login'))}
        />
      )}
    </Flex>
  );
};
