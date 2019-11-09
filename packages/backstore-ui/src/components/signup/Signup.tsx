import React from 'react';
import { Flex, Title, SignupForm, Text } from '@lamk/blocks-ui';
import { sdk } from '@lamk/la-sdk';
import { useDispatch } from 'react-redux';
import { signup } from '../../state/modules/auth/auth.module';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import {useTranslation} from 'react-i18next';

export const Signup = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const handleSignup = (data: any) => {
    dispatch(signup(data, 'local'));
  };

  return (
    <Flex flexDirection='column' alignItems='center'>
      <Title mt={5} level={1}>
        {t('auth.signup')}
      </Title>
      <Text mb={5} type='secondary'>
        {t('auth.signupClosedBeta')}
      </Text>

      <SignupForm
        signup={handleSignup}
        validate={sdk.user.validate as any}
        validateSingle={sdk.user.validateSingle as any}
        onLoginNowClick={() => dispatch(goTo('/login'))}
      />
    </Flex>
  );
};
