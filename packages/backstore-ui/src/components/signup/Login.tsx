import React from 'react';
import { Flex, Title, LoginForm } from '@lamk/blocks-ui';
import { sdk } from '@lamk/la-sdk';
import { useDispatch } from 'react-redux';
import { login } from '../../state/modules/auth/auth.module';
import { goTo } from '../../state/modules/navigation/navigation.actions';

export const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = (data: any) => {
    dispatch(login(data, 'local'));
  };

  return (
    <Flex width='100%' flexDirection='column' alignItems='center'>
      <Title mt={5} level={1}>
        Log in
      </Title>
      <LoginForm
        login={handleLogin}
        validate={sdk.user.validate as any}
        validateSingle={sdk.user.validateSingle as any}
        onSignupNowClick={() => dispatch(goTo('/signup'))}
      />
    </Flex>
  );
};
