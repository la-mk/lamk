import React from 'react';
import {
  Spinner,
  hooks,
  message,
  ChangePasswordForm,
} from '@sradevski/blocks-ui';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { sdk } from '@sradevski/la-sdk';
import { patchUser } from '../../../state/modules/user/user.module';
import { TFunction } from 'i18next';

export const PasswordForm = ({ user, t }: { user: User; t: TFunction }) => {
  const [caller, showSpinner] = hooks.useCall();

  const handlePatchAccount = ({ formData }: { formData: Partial<User> }) => {
    caller(sdk.user.patch(user._id, formData), (user: User) => {
      message.success(t('auth.accountUpdateSuccess'));
      return patchUser(user);
    });
  };

  // TODO: The same is in the store, unify it.
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
  );
};
