import React, { useState } from 'react';
import { User } from 'la-sdk/dist/models/user';
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
} from 'blocks-ui';
import { useDispatch } from 'react-redux';
import { sdk } from 'la-sdk';
import { patchUser } from '../../state/modules/user/user.module';
import { pickDiff } from '../../common/utils';
import { Addresses } from './Addresses';
import { Page } from '../shared/Page';

interface AccountProps {
  user: User;
}

export const Account = ({ user }: AccountProps) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [tab, setTab] = useState('addresses');
  const dispatch = useDispatch();

  const handlePatchAccount = (updatedUser: User) => {
    setShowSpinner(true);
    const updatedFields = pickDiff(user, updatedUser);

    sdk.user
      .patch(user._id, updatedFields)
      .then(product => {
        dispatch(patchUser(product));
        message.success(`Account successfully updated`);
      })
      .catch(err => message.error(err.message))
      .finally(() => setShowSpinner(false));
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
              validate={sdk.user.validate}
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
