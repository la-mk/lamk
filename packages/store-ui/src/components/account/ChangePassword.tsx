import { ChangePasswordForm, hooks, Spinner, toast } from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import { User } from '@la-mk/la-sdk/dist/models/user';
import React from 'react';
import { useTranslation } from '../../common/i18n';
import { patchUser } from '../../state/modules/user/user.module';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { Page } from '../shared/Page';

export const ChangePassword = ({ user }: { user: User }) => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/account/change-password', title: t('pages.changePassword') },
  ]);

  const handlePatchAccount = React.useCallback(
    ({ formData }: { formData: Partial<User> }) => {
      caller(sdk.user.patch(user._id, formData), (user: User) => {
        toast.success(t('auth.accountUpdateSuccess'));
        return patchUser(user);
      });
    },
    [],
  );

  // currentPassword is a special field and is not part of the schema, but we want it to have the same characteristics as the standard password.
  const changePasswordSchema = sdk.utils.schema.pick(sdk.user.schema, [
    'password',
  ]);
  changePasswordSchema.properties = {
    currentPassword: changePasswordSchema.properties.password,
    password: changePasswordSchema.properties.password,
  };
  changePasswordSchema.required.push('currentPassword');

  return (
    <Page maxWidth='86rem'>
      <Spinner isLoaded={!showSpinner}>
        <ChangePasswordForm
          schema={changePasswordSchema}
          emphasized
          onSubmit={handlePatchAccount}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        />
      </Spinner>
    </Page>
  );
};
