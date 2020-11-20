import pick from 'lodash/pick';
import React, { useState } from 'react';
import { User } from '@sradevski/la-sdk/dist/models/user';
import {
  Button,
  Flex,
  message,
  Spin,
  Tabs,
  TabPane,
  hooks,
  NewForm,
  ChangePasswordForm,
  Box,
  Label,
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
  const [caller, showSpinner] = hooks.useCall();
  const [tab, setTab] = useState('personal');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [userFormData, setUserFormData] = hooks.useFormState<Partial<User>>(
    pick(user, ['firstName', 'lastName', 'phoneNumber']),
    {},
    [user],
  );
  const { t } = useTranslation();

  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/account', title: t('pages.myAccount') },
  ]);

  const handlePatchAccount = ({ formData }: { formData: Partial<User> }) => {
    caller(sdk.user.patch(user._id, formData), (user: User) => {
      message.success(t('auth.accountUpdateSuccess'));
      return patchUser(user);
    });
  };

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
    <Page>
      <Tabs animated={false} activeKey={tab} onChange={setTab}>
        <TabPane
          pt={4}
          tab={<Label>{t('common.personalInfo')}</Label>}
          key='personal'
        >
          <Spin spinning={showSpinner}>
            <Flex
              alignItems='center'
              justifyContent='center'
              flexDirection='column'
              width={'100%'}
              maxWidth={600}
              minWidth={200}
              mx='auto'
            >
              <Box width='100%'>
                <NewForm<Pick<User, 'firstName' | 'lastName' | 'phoneNumber'>>
                  schema={sdk.utils.schema.pick(sdk.user.schema, [
                    'firstName',
                    'lastName',
                    'phoneNumber',
                  ])}
                  uiSchema={{
                    firstName: {
                      'ui:title': t('common.firstName'),
                      'ui:options': {
                        emphasized: true,
                      },
                    },
                    lastName: {
                      'ui:title': t('common.lastName'),
                      'ui:options': {
                        emphasized: true,
                      },
                    },
                    phoneNumber: {
                      'ui:title': t('common.phoneNumber'),
                      'ui:options': {
                        emphasized: true,
                      },
                    },
                  }}
                  onSubmit={handlePatchAccount}
                  onChange={({ formData }) => setUserFormData(formData)}
                  formData={userFormData}
                  getErrorMessage={(errorName, context) =>
                    t(`errors.${errorName}`, context)
                  }
                >
                  <Button width='100%' type='submit'>
                    {t('actions.update')}
                  </Button>
                </NewForm>
              </Box>
            </Flex>
          </Spin>
        </TabPane>
        <TabPane
          pt={4}
          tab={<Label>{t('common.password')}</Label>}
          key='password'
        >
          <Spin spinning={showSpinner}>
            <ChangePasswordForm
              schema={changePasswordSchema}
              emphasized
              onSubmit={handlePatchAccount}
              getErrorMessage={(errorName, context) =>
                t(`errors.${errorName}`, context)
              }
            />
          </Spin>
        </TabPane>
        <TabPane
          pt={4}
          tab={<Label>{t('common.address_plural')}</Label>}
          key='addresses'
        >
          <Flex mb={4} alignItems='center' justifyContent='center'>
            <Button onClick={() => setShowAddAddressModal(true)}>
              {t('address.addNewAddress')}
            </Button>
          </Flex>
          <Addresses
            user={user}
            showAddModal={showAddAddressModal}
            setShowAddModal={setShowAddAddressModal}
          />
        </TabPane>
      </Tabs>
    </Page>
  );
};
