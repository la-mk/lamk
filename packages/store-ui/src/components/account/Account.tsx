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

interface AccountProps {
  user: User;
}

export const Account = ({ user }: AccountProps) => {
  const [caller, showSpinner] = useCall();
  const [tab, setTab] = useState('addresses');

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
        <TabPane pt={4} tab={'Personal Info'} key='personal'>
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
            >
              <FormItem selector='firstName' label='First Name'>
                {formInput()}
              </FormItem>

              <FormItem selector='lastName' label='Last Name'>
                {formInput()}
              </FormItem>

              <FormItem selector='phoneNumber' label='Phone Number'>
                {formInput()}
              </FormItem>

              <Flex justifyContent='center' alignItems='center'>
                <Button mr={2} type='primary' htmlType='submit' size='large'>
                  Update
                </Button>
              </Flex>
            </Form>
          </Spin>
        </TabPane>
        <TabPane pt={4} tab={'Addresses'} key='addresses'>
          <Addresses user={user} />
        </TabPane>
      </Tabs>
    </Page>
  );
};
