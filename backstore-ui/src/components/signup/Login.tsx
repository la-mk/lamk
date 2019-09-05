import React from 'react';
import {
  Flex,
  Col,
  Form,
  FormItem,
  formInput,
  Button,
  Title,
  message,
} from 'blocks-ui';
import { sdk } from 'la-sdk';
import { useDispatch } from 'react-redux';
import { replaceTo } from '../../state/modules/navigation/navigation.actions';
import { setStore } from '../../state/modules/store/store.module';

export const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = (data: any) => {
    sdk.authentication
      .authenticate({
        strategy: 'local',
        email: data.email,
        password: data.password,
      })
      .then(() => {
        return sdk.store
          .find()
          .then(stores => {
            if (stores.total > 0) {
              dispatch(setStore(stores.data[0]));
            }
          })
          .catch(err => message.error(err.message));
      })
      .then(() => {
        dispatch(replaceTo('/'));
      })
      .catch(err => message.error(err.message));
  };

  return (
    <Flex width='100%' flexDirection='column' alignItems='center'>
      <Title mt={5} level={1}>
        Welcome to la.mk
      </Title>

      <Col width={['100%', '80%', '60%']}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          layout='horizontal'
          colon={false}
          onFormCompleted={handleLogin}
          validate={sdk.user.validate}
          validateSingle={sdk.user.validateSingle}
        >
          <FormItem selector='email' label='Email Address'>
            {formInput()}
          </FormItem>

          <FormItem selector='password' label='Password'>
            {formInput({ type: 'password' })}
          </FormItem>

          <Flex justifyContent='center' alignItems='center'>
            <Button mr={2} type='primary' htmlType='submit' size='large'>
              Login
            </Button>
          </Flex>
        </Form>
      </Col>
    </Flex>
  );
};
