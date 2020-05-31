import React from 'react';
import {
  Modal,
  Flex,
  Title,
  LoginForm,
  SignupForm,
  hooks,
} from '@sradevski/blocks-ui';
import { useSelector, useDispatch } from 'react-redux';
import { shouldShowAuthModal } from '../../state/modules/ui/ui.selector';
import { toggleAuthModal } from '../../state/modules/ui/ui.module';
import { login, signup } from '../../state/modules/auth/auth.module';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from '../../common/i18n';

export const AuthModal = () => {
  const [method, setMethod] = React.useState<'login' | 'signup'>('login');
  const modalWidth = hooks.useBreakpoint(['100%', '80%', '60%']);

  const visible = useSelector(shouldShowAuthModal);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleLogin = (data: any) => {
    dispatch(login(data, 'local'));
  };

  const handleSignup = (data: any) => {
    dispatch(signup(data, 'local'));
  };

  return (
    <Modal
      width={modalWidth}
      centered
      destroyOnClose
      visible={visible}
      footer={null}
      onCancel={() => dispatch(toggleAuthModal(false))}
    >
      <Flex
        pt={4}
        pb={5}
        width='100%'
        flexDirection='column'
        alignItems='center'
      >
        {method === 'login' && (
          <LoginForm
            // logoUrl='/images/lamk-logo/horizontal.svg'
            login={handleLogin}
            onSignupNowClick={() => setMethod('signup')}
            validate={data => sdk.user.validate(data as any, true) as any}
            validateSingle={sdk.user.validateSingle as any}
            getErrorMessage={(errorName, context) =>
              t(`errors.${errorName}`, context)
            }
          />
        )}
        {method === 'signup' && (
          <SignupForm
            // logoUrl='/images/lamk-logo/horizontal.svg'
            signup={handleSignup}
            onLoginNowClick={() => setMethod('login')}
            validate={data => sdk.user.validate(data as any, true)}
            validateSingle={sdk.user.validateSingle as any}
            getErrorMessage={(errorName, context) =>
              t(`errors.${errorName}`, context)
            }
          />
        )}
      </Flex>
    </Modal>
  );
};
