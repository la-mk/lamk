import React, { useState } from 'react';
import { User } from '@lamk/la-sdk/dist/models/user';
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
} from '@lamk/blocks-ui';
import { sdk } from '@lamk/la-sdk';
import { patchUser } from '../../state/modules/user/user.module';
import { pickDiff } from '../../common/utils';
import { Addresses } from './Addresses';
import { Page } from '../shared/Page';
import { useCall } from '../shared/hooks/useCall';
import { useTranslation } from '../../common/i18n';

interface AccountProps {
  user: User;
}

export const Account = ({ user }: AccountProps) => {
  const [caller, showSpinner] = useCall();
  const [tab, setTab] = useState('addresses');
  const { t } = useTranslation();

  const handlePatchAccount = (updatedUser: User) => {
    const updatedFields = pickDiff(user, updatedUser);
    caller(sdk.user.patch(user._id, updatedFields), (user: User) => {
      message.success(`Account successfully updated`);
      return patchUser(user);
    });
  };

  return (
    <Page title='My account'>
      <Tabs animated={false} activeKey={tab} onChange={setTab}>
        <TabPane pt={4} tab={t('common.personalInfo')} key='personal'>
          <Spin spinning={showSpinner}>
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 12 }}
              layout='horizontal'
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
                {formInput()}
              </FormItem>

              <FormItem selector='lastName' label={t('common.lastName')}>
                {formInput()}
              </FormItem>

              <FormItem selector='phoneNumber' label={t('common.phoneNumber')}>
                {formInput()}
              </FormItem>

              <Flex justifyContent='center' alignItems='center'>
                <Button mr={2} type='primary' htmlType='submit' size='large'>
                  {t('actions.update')}
                </Button>
              </Flex>
            </Form>
          </Spin>
        </TabPane>
        <TabPane pt={4} tab={t('common.address_plural')} key='addresses'>
          <Addresses user={user} />
        </TabPane>
      </Tabs>
    </Page>
  );
};
