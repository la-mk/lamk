import React from 'react';
import { Flex, Title, LoginForm } from '@lamk/blocks-ui';
import { sdk } from '@lamk/la-sdk';
import { useDispatch } from 'react-redux';
import { login } from '../../state/modules/auth/auth.module';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import {useTranslation} from 'react-i18next';

export const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleLogin = (data: any) => {
    dispatch(login(data, 'local'));
  };

  return (
    <Flex width='100%' flexDirection='column' alignItems='center'>
      <Title mt={5} level={1}>
        {t('auth.login')}
      </Title>
      <LoginForm
        login={handleLogin}
        validate={(data) => sdk.user.validate(data as any, true) as any}
        validateSingle={sdk.user.validateSingle}
        getErrorMessage={(errorName, context) => t(`errors.${errorName}`, context)}
        onSignupNowClick={() => dispatch(goTo('/signup'))}
      />
    </Flex>
  );
};
