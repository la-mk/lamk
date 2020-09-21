import { hooks, ResetPasswordForm, Spin, message } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
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

  const handleResetPasswordSubmitted = async (data: any) => {
    caller(
      sdk.user.patch(
        null,
        { password: data.password },
        { query: { email: data.email.toLowerCase(), resetToken } },
      ),
      () => {
        message.success(t('auth.resetPasswordSuccess'));
        dispatch(goTo('/'));
      },
    );
  };

  return (
    <Page>
      <Spin spinning={showSpinner}>
        <ResetPasswordForm
          onLoginInstead={() => dispatch(toggleAuthModal(true))}
          onFormCompleted={handleResetPasswordSubmitted}
          validate={(data: any) => sdk.user.validate(data, true)}
          validateSingle={sdk.user.validateSingle}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        />
      </Spin>
    </Page>
  );
};
