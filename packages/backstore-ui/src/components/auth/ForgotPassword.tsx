import { ForgotPasswordForm, hooks, Spin } from '@sradevski/blocks-ui';
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

  const handleForgotPasswordSubmitted = async (data: any) => {
    caller(sdk.authManagement.resetPassword(data.email.toLowerCase()), () =>
      setSubmitttedSuccessfully(true),
    );
  };

  return (
    <Spin spinning={showSpinner}>
      <AuthBase>
        <ForgotPasswordForm
          hasSubmitted={submittedSuccessfully}
          onLoginInstead={() => dispatch(goTo('/login'))}
          onFormCompleted={handleForgotPasswordSubmitted}
          validate={(data: any) => sdk.authManagement.validate(data, true)}
          validateSingle={sdk.authManagement.validateSingle}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        />
      </AuthBase>
    </Spin>
  );
};
