import React from 'react';
import {
  Modal,
  Flex,
  LoginForm,
  SignupForm,
  hooks,
  ForgotPasswordForm,
  Spinner,
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
  const visible = useSelector(shouldShowAuthModal);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const [forgotPasswordDone, setForgotPasswordDone] = React.useState(false);

  const handleForgotPasswordSubmitted = ({ formData }: any) => {
    caller(
      sdk.authManagement.resetPassword(
        formData.email.toLowerCase(),
        store?._id,
      ),
      () => setForgotPasswordDone(true),
    );
  };

  const handleLogin = (data: any) => {
    dispatch(login({ ...data, email: data.email?.toLowerCase() }, 'local'));
  };

  const handleSignup = (data: any) => {
    dispatch(signup({ ...data, email: data.email?.toLowerCase() }, 'local'));
  };

  const authSchema = sdk.utils.schema.pick(sdk.user.schema, [
    'email',
    'password',
  ]);

  return (
    <Modal
      maxWidth={['96%', '88%', '56%']}
      isOpen={visible}
      onClose={() => {
        dispatch(toggleAuthModal(false));
        setMethod('login');
        setForgotPasswordDone(false);
      }}
    >
      <Flex py={5} width='100%' direction='column' align='center'>
        {method === 'login' && (
          <LoginForm
            schema={authSchema}
            logoUrl='/images/lamk-logo/horizontal.svg'
            login={handleLogin}
            onSignupNowClick={() => setMethod('signup')}
            onForgotPasswordClick={() => setMethod('forgotPassword')}
            getErrorMessage={(errorName, context) =>
              t(`errors.${errorName}`, context)
            }
          />
        )}
        {method === 'signup' && (
          <SignupForm
            schema={authSchema}
            logoUrl='/images/lamk-logo/horizontal.svg'
            signup={handleSignup}
            onLoginNowClick={() => setMethod('login')}
            getErrorMessage={(errorName, context) =>
              t(`errors.${errorName}`, context)
            }
          />
        )}
        {method === 'forgotPassword' && (
          <Spinner isLoaded={!showSpinner}>
            <ForgotPasswordForm
              schema={sdk.utils.schema.pick(sdk.user.schema, ['email'])}
              hasSubmitted={forgotPasswordDone}
              onLoginInstead={() => setMethod('login')}
              onSubmit={handleForgotPasswordSubmitted}
              getErrorMessage={(errorName, context) =>
                t(`errors.${errorName}`, context)
              }
            />
          </Spinner>
        )}
      </Flex>
    </Modal>
  );
};
