import { hooks, ResetPasswordForm, Spin, message } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import { AuthBase } from './AuthBase';

export const ResetPassword = ({
  resetToken,
}: {
  resetToken: string | null;
}) => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const dispatch = useDispatch();

  const handleResetPasswordSubmitted = async (data: any) => {
    caller(
      sdk.user.patch(
        null,
        { password: data.password },
        { query: { email: data.email.toLowerCase(), resetToken } },
      ),
      () => {
        message.success(t('auth.resetPasswordSuccess'));
        dispatch(goTo('/login'));
      },
    );
  };

  return (
    <Spin spinning={showSpinner}>
      <AuthBase>
        <ResetPasswordForm
          onLoginInstead={() => dispatch(goTo('/login'))}
          onFormCompleted={handleResetPasswordSubmitted}
          validate={(data: any) => sdk.user.validate(data, true)}
          validateSingle={sdk.user.validateSingle}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        />
      </AuthBase>
    </Spin>
  );
};
