import React from 'react';
import { Flex, Title, LoginForm } from 'blocks-ui';
import { sdk } from 'la-sdk';
import { useDispatch } from 'react-redux';
import { login } from '../../state/modules/auth/auth.module';

export const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = (data: any) => {
    dispatch(login(data, 'local'));
  };

  return (
    <Flex width='100%' flexDirection='column' alignItems='center'>
      <Title mt={5} level={1}>
        Welcome to la.mk
      </Title>
      <LoginForm
        login={handleLogin}
        validate={sdk.user.validate as any}
        validateSingle={sdk.user.validateSingle as any}
      />
    </Flex>
  );
};
