import { ForgotPasswordForm, hooks, Spinner } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import { AuthBase } from './AuthBase';

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [caller, showSpinner] = hooks.useCall();
  const [submittedSuccessfully, setSubmitttedSuccessfully] = React.useState(
    false,
  );

  const handleForgotPasswordSubmitted = async ({ formData }: any) => {
    caller(sdk.authManagement.resetPassword(formData.email.toLowerCase()), () =>
      setSubmitttedSuccessfully(true),
    );
  };

  return (
    <Spinner isLoaded={!showSpinner}>
      <AuthBase>
        <ForgotPasswordForm
          schema={sdk.utils.schema.pick(sdk.user.schema, ['email'])}
          hasSubmitted={submittedSuccessfully}
          onLoginInstead={() => dispatch(goTo('/login'))}
          onSubmit={handleForgotPasswordSubmitted}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        />
      </AuthBase>
    </Spinner>
  );
};
