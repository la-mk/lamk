import React from 'react';
import { Modal, Flex, Title, LoginForm, SignupForm } from 'blocks-ui';
import { useSelector, useDispatch } from 'react-redux';
import { shouldShowAuthModal } from '../../state/modules/ui/ui.selector';
import { toggleAuthModal } from '../../state/modules/ui/ui.module';
import { login, signup } from '../../state/modules/auth/auth.module';
import { sdk } from 'la-sdk';

export const AuthModal = () => {
  const [method, setMethod] = React.useState<'login' | 'signup'>('login');
  const visible = useSelector(shouldShowAuthModal);
  const dispatch = useDispatch();

  const handleLogin = (data: any) => {
    dispatch(login(data, 'local'));
    dispatch(toggleAuthModal(false));
  };

  const handleSignup = (data: any) => {
    dispatch(signup(data, 'local'));
    dispatch(toggleAuthModal(false));
  };

  return (
    <Modal
      width='80%'
      centered
      visible={visible}
      footer={null}
      onCancel={() => dispatch(toggleAuthModal(false))}
    >
      {method === 'login' && (
        <Flex width='100%' flexDirection='column' alignItems='center'>
          <Title mb={5} level={1}>
            Login
          </Title>
          <LoginForm
            login={handleLogin}
            onSignupNowClick={() => setMethod('signup')}
            validate={sdk.user.validate as any}
            validateSingle={sdk.user.validateSingle as any}
          />
        </Flex>
      )}
      {method === 'signup' && (
        <Flex width='100%' flexDirection='column' alignItems='center'>
          <Title mb={5} level={1}>
            Signup
          </Title>
          <SignupForm
            signup={handleSignup}
            onLoginNowClick={() => setMethod('login')}
            validate={sdk.user.validate as any}
            validateSingle={sdk.user.validateSingle as any}
          />
        </Flex>
      )}
    </Modal>
  );
};
