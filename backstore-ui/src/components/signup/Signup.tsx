import React from 'react';
import { Flex, Title, SignupForm } from 'blocks-ui';
import { sdk } from 'la-sdk';
import { useDispatch } from 'react-redux';
import { signup } from '../../state/modules/auth/auth.module';

export const Signup = () => {
  const dispatch = useDispatch();
  const handleSignup = (data: any) => {
    dispatch(signup(data, 'local'));
  };

  return (
    <Flex flexDirection='column' alignItems='center'>
      <Title mt={5} level={1}>
        Welcome to la.mk
      </Title>

      <SignupForm
        signup={handleSignup}
        validate={sdk.user.validate as any}
        validateSingle={sdk.user.validateSingle as any}
      />
    </Flex>
  );
};
