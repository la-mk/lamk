import React from 'react';
import { Flex, Col, Form, FormItem, formInput, Button, Title } from 'blocks-ui';
import { sdk } from 'la-sdk';
import { useDispatch } from 'react-redux';
import { login } from '../../state/modules/auth/auth.module';

export const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = (data: any) => {
    dispatch(login(data, 'local'));
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
