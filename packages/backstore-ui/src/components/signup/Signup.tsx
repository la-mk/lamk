import React from 'react';
import { Flex, Title, SignupForm, Text, Button } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { useDispatch } from 'react-redux';
import { signup, Credentials } from '../../state/modules/auth/auth.module';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import { useTranslation } from 'react-i18next';

export const Signup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleSignup = (data: Credentials) => {
    dispatch(signup(data, 'local'));
  };

  return (
    <Flex flexDirection='column' alignItems='center' p={3}>
      <Title mt={6} level={1}>
        {t('auth.signup')}
      </Title>
      <Text mb={6} type='secondary'>
        {t('auth.signupClosedBeta')}
      </Text>
      <Button type='primary' onClick={() => dispatch(goTo('/login'))}>
        {t('auth.login')}
      </Button>
      {/* <SignupForm
        signup={handleSignup}
        validate={data => sdk.user.validate(data, true)}
        validateSingle={sdk.user.validateSingle}
        getErrorMessage={(errorName, context) =>
          t(`errors.${errorName}`, context)
        }
        onLoginNowClick={() => dispatch(goTo('/login'))}
      /> */}
    </Flex>
  );
};
