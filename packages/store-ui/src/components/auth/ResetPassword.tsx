import { hooks, ResetPasswordForm, Spinner, toast } from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import React from 'react';
import { useTranslation } from '../../common/i18n';
import { useDispatch } from 'react-redux';
import { Page } from '../shared/Page';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import { toggleAuthModal } from '../../state/modules/ui/ui.module';

export const ResetPassword = ({
  resetToken,
}: {
  resetToken: string | undefined;
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
        dispatch(goTo('/'));
      },
    );
  };

  return (
    <Page>
      <Spinner isLoaded={!showSpinner}>
        <ResetPasswordForm
          schema={
            sdk.utils.schema.pick(sdk.user.schema, ['email', 'password']) as any
          }
          onLoginInstead={() => dispatch(toggleAuthModal(true))}
          onSubmit={handleResetPasswordSubmitted}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        />
      </Spinner>
    </Page>
  );
};
