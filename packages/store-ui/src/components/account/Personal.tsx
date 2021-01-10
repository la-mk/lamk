import {
  BasicUserForm,
  Button,
  hooks,
  Spinner,
  Text,
  toast,
} from '@la-mk/blocks-ui';
import pick from 'lodash/pick';
import { sdk } from '@la-mk/la-sdk';
import { User } from '@la-mk/la-sdk/dist/models/user';
import React from 'react';
import { useTranslation } from '../../common/i18n';
import { patchUser } from '../../state/modules/user/user.module';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { Page } from '../shared/Page';
import { BackButton } from './BackButton';

export const Personal = ({ user }: { user: User }) => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/account/personal', title: t('pages.personalDetails') },
  ]);

  const [userFormData, setUserFormData] = hooks.useFormState<Partial<User>>(
    pick(user, ['firstName', 'lastName', 'phoneNumber']),
    {},
    [user],
  );

  const handlePatchAccount = React.useCallback(
    ({ formData }: { formData: Partial<User> }) => {
      caller(sdk.user.patch(user._id, formData), (user: User) => {
        toast.success(t('auth.accountUpdateSuccess'));
        return patchUser(user);
      });
    },
    [],
  );

  return (
    <Page maxWidth={'86rem'}>
      <BackButton />
      <Spinner isLoaded={!showSpinner}>
        <BasicUserForm
          schema={sdk.utils.schema.pick(sdk.user.schema, [
            'firstName',
            'lastName',
            'phoneNumber',
          ])}
          emphasized
          onSubmit={handlePatchAccount}
          onChange={({ formData }) => setUserFormData(formData)}
          formData={userFormData}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        />
      </Spinner>
    </Page>
  );
};
