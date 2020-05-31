import React, { useState } from 'react';
import { User } from '@sradevski/la-sdk/dist/models/user';
import {
  Form,
  FormItem,
  formInput,
  Button,
  Flex,
  message,
  Spin,
  Tabs,
  TabPane,
  hooks,
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
              <Form
                width='100%'
                labelCol={{
                  xs: { span: 24 },
                }}
                wrapperCol={{
                  xs: { span: 24 },
                }}
                layout='vertical'
                colon={false}
                onFormCompleted={handlePatchAccount}
                externalState={user}
                validate={data => sdk.user.validate(data, true)}
                validateSingle={sdk.user.validateSingle}
                getErrorMessage={(errorName, context) =>
                  t(`errors.${errorName}`, context)
                }
              >
                <FormItem selector='firstName' label={t('common.firstName')}>
                  {formInput({ size: 'large' })}
                </FormItem>

                <FormItem selector='lastName' label={t('common.lastName')}>
                  {formInput({ size: 'large' })}
                </FormItem>

                <FormItem
                  selector='phoneNumber'
                  label={t('common.phoneNumber')}
                >
                  {formInput({ size: 'large' })}
                </FormItem>

                <Flex mt={4} justifyContent='center' alignItems='center'>
                  <Button
                    width='100%'
                    type='primary'
                    htmlType='submit'
                    size='large'
                  >
                    {t('actions.update')}
                  </Button>
                </Flex>
              </Form>
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
