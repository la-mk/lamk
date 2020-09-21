import React from 'react';
import {
  Modal,
  Flex,
  LoginForm,
  SignupForm,
  hooks,
  ForgotPasswordForm,
  Spin,
} from '@sradevski/blocks-ui';
import { useSelector, useDispatch } from 'react-redux';
import { shouldShowAuthModal } from '../../state/modules/ui/ui.selector';
import { toggleAuthModal } from '../../state/modules/ui/ui.module';
import { login, signup } from '../../state/modules/auth/auth.module';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from '../../common/i18n';
import { getStore } from '../../state/modules/store/store.selector';

export const AuthModal = () => {
  const [method, setMethod] = React.useState<
    'login' | 'signup' | 'forgotPassword'
  >('login');
  const store = useSelector(getStore);
  const modalWidth = hooks.useBreakpoint(['100%', '80%', '60%']);
  const visible = useSelector(shouldShowAuthModal);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const [forgotPasswordDone, setForgotPasswordDone] = React.useState(false);

  const handleForgotPasswordSubmitted = (data: any) => {
    caller(
      sdk.authManagement.resetPassword(data.email.toLowerCase(), store?._id),
      () => setForgotPasswordDone(true),
    );
  };

  const handleLogin = (data: any) => {
    dispatch(login({ ...data, email: data.email?.toLowerCase() }, 'local'));
  };

  const handleSignup = (data: any) => {
    dispatch(signup({ ...data, email: data.email?.toLowerCase() }, 'local'));
  };

  return (
    <Modal
      width={modalWidth}
      centered
      destroyOnClose
      visible={visible}
      footer={null}
      onCancel={() => {
        dispatch(toggleAuthModal(false));
        setMethod('login');
      }}
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
            logoUrl='/images/lamk-logo/horizontal.svg'
            login={handleLogin}
            onSignupNowClick={() => setMethod('signup')}
            onForgotPasswordClick={() => setMethod('forgotPassword')}
            validate={data => sdk.user.validate(data as any, true) as any}
            validateSingle={sdk.user.validateSingle as any}
            getErrorMessage={(errorName, context) =>
              t(`errors.${errorName}`, context)
            }
          />
        )}
        {method === 'signup' && (
          <SignupForm
            logoUrl='/images/lamk-logo/horizontal.svg'
            signup={handleSignup}
            onLoginNowClick={() => setMethod('login')}
            validate={data => sdk.user.validate(data as any, true)}
            validateSingle={sdk.user.validateSingle as any}
            getErrorMessage={(errorName, context) =>
              t(`errors.${errorName}`, context)
            }
          />
        )}
        {method === 'forgotPassword' && (
          <Spin spinning={showSpinner}>
            <ForgotPasswordForm
              hasSubmitted={forgotPasswordDone}
              onLoginInstead={() => setMethod('login')}
              onFormCompleted={handleForgotPasswordSubmitted}
              validate={(data: any) => sdk.authManagement.validate(data, true)}
              validateSingle={sdk.authManagement.validateSingle}
              getErrorMessage={(errorName, context) =>
                t(`errors.${errorName}`, context)
              }
            />
          </Spin>
        )}
      </Flex>
    </Modal>
  );
};
