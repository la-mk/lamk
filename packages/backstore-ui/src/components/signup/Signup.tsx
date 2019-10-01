import React from 'react';
import { Flex, Title, SignupForm, Text } from 'blocks-ui';
import { sdk } from 'la-sdk';
import { useDispatch } from 'react-redux';
import { signup } from '../../state/modules/auth/auth.module';
import { goTo } from '../../state/modules/navigation/navigation.actions';

export const Signup = () => {
  const dispatch = useDispatch();
  const handleSignup = (data: any) => {
    dispatch(signup(data, 'local'));
  };

  return (
    <Flex flexDirection='column' alignItems='center'>
      <Title mt={5} level={1}>
        Sign up
      </Title>
      <Text mb={5} type='secondary'>
        We are in closed-beta, so signups are currently disabled
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
