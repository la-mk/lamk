import omit from 'lodash/omit';
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
  UserForm,
  ChangePasswordForm,
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { patchUser } from '../../state/modules/user/user.module';
import { pickDiff } from '../../common/utils';
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
  const { t } = useTranslation();

  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/account', title: t('pages.myAccount') },
  ]);

  const handlePatchAccount = (updatedUser: User) => {
    const updatedFields = pickDiff(user, updatedUser);
    caller(sdk.user.patch(user._id, updatedFields), (user: User) => {
      message.success(t('auth.accountUpdateSuccess'));
      return patchUser(user);
    });
  };

  return (
    <Page>
      <Tabs animated={false} activeKey={tab} onChange={setTab}>
        <TabPane pt={4} tab={t('common.personalInfo')} key='personal'>
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
              <UserForm
                size='large'
                onFormCompleted={handlePatchAccount}
                externalState={user}
                validate={data => sdk.user.validate(data, true)}
                validateSingle={sdk.user.validateSingle}
                getErrorMessage={(errorName, context) =>
                  t(`errors.${errorName}`, context)
                }
              />
            </Flex>
          </Spin>
        </TabPane>
        <TabPane pt={4} tab={t('common.password')} key='password'>
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
              <ChangePasswordForm
                size='large'
                onFormCompleted={handlePatchAccount}
                externalState={user}
                // We don't want to validate `currentPassword` as it is a special field that is only used for comparison
                validate={data =>
                  sdk.user.validate(omit(data, ['currentPassword']), true)
                }
                validateSingle={(val, selector) => {
                  if (selector === 'currentPassword') {
                    return;
                  }
                  return sdk.user.validateSingle(val, selector);
                }}
                getErrorMessage={(errorName, context) =>
                  t(`errors.${errorName}`, context)
                }
              />
            </Flex>
          </Spin>
        </TabPane>
        <TabPane pt={4} tab={t('common.address_plural')} key='addresses'>
          <Flex mb={4} alignItems='center' justifyContent='center'>
            <Button type='primary' onClick={() => setShowAddAddressModal(true)}>
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
