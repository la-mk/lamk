import pick from 'lodash/pick';
import React, { useState } from 'react';
import { User } from '@sradevski/la-sdk/dist/models/user';
import {
  Button,
  Flex,
  toast,
  Spinner,
  Tabs,
  hooks,
  NewForm,
  ChangePasswordForm,
  Box,
  BasicUserForm,
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { patchUser } from '../../state/modules/user/user.module';
import { Addresses } from './Addresses';
import { Page } from '../shared/Page';
import { useTranslation } from '../../common/i18n';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';

interface AccountProps {
  user: User;
}

export const Account = ({ user }: AccountProps) => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const [tab, setTab] = useState(0);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [userFormData, setUserFormData] = hooks.useFormState<Partial<User>>(
    pick(user, ['firstName', 'lastName', 'phoneNumber']),
    {},
    [user],
  );

  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/account', title: t('pages.myAccount') },
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
    <Page maxWidth={'86rem'}>
      <Tabs
        index={tab}
        onChange={setTab}
        items={[
          {
            title: t('common.personalInfo'),
            content: (
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
            ),
          },
          {
            title: t('common.password'),
            content: (
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
            ),
          },
          {
            title: t('common.address_plural'),
            content: (
              <>
                <Flex mb={6} align='center' justify='center'>
                  <Button onClick={() => setShowAddAddressModal(true)}>
                    {t('address.addNewAddress')}
                  </Button>
                </Flex>
                <Addresses
                  user={user}
                  showAddModal={showAddAddressModal}
                  setShowAddModal={setShowAddAddressModal}
                />
              </>
            ),
          },
        ]}
      />
    </Page>
  );
};
