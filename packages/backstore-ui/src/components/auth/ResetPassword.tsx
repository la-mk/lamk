import { hooks, ResetPasswordForm, Spinner, toast } from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
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

  const handleResetPasswordSubmitted = async ({ formData }: any) => {
    caller(
      sdk.user.patch(
        null,
        { password: formData.password },
        { query: { email: formData.email.toLowerCase(), resetToken } },
      ),
      () => {
        toast.success(t('auth.resetPasswordSuccess'));
        dispatch(goTo('/login'));
      },
    );
  };

  return (
    <Spinner isLoaded={!showSpinner}>
      <AuthBase>
        <ResetPasswordForm
          schema={
            sdk.utils.schema.pick(sdk.user.schema, ['email', 'password']) as any
          }
          onLoginInstead={() => dispatch(goTo('/login'))}
          onSubmit={handleResetPasswordSubmitted}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        />
      </AuthBase>
    </Spinner>
  );
};
