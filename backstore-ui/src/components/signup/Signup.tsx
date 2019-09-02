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

export const Signup = () => {
  const dispatch = useDispatch();
  const handleSignup = (data: any) => {
    sdk.user
      .create(data)
      .then(user => console.log(user))
      .then(() =>
        sdk.authentication.authenticate({
          strategy: 'local',
          email: data.email,
          password: data.password,
        }),
      )
      .then(() => dispatch(replaceTo('/dashboard')))
      .catch(err => message.error(err.message));
  };

  return (
    <Flex flexDirection='column' alignItems='center'>
      <Title mt={5} level={1}>
        Welcome to la.mk
      </Title>

      <Col width={['100%', '80%', '60%']}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          layout='horizontal'
          colon={false}
          onFormCompleted={handleSignup}
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
              Signup
            </Button>
          </Flex>
        </Form>
      </Col>
    </Flex>
  );
};
