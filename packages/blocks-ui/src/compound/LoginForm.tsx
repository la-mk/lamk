import React from 'react';
import { Flex, Col, Form, FormItem, formInput, Button, Title } from '..';
import { Text } from '../basic/Typography';
import { Divider } from '../basic/Divider';

export interface LoginProps {
  login: (credentials: LoginCredentials) => void;
  onSignupNowClick: () => void;
  validate: (data: LoginCredentials) => { [key: string]: string };
  validateSingle: (val: any, selector: string) => string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const LoginForm = ({
  login,
  onSignupNowClick,
  validate,
  validateSingle,
}: LoginProps) => {
  return (
    <>
      <Col width={['100%', '80%', '60%']}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          layout='horizontal'
          colon={false}
          onFormCompleted={(data: LoginCredentials) => login(data)}
          validate={validate}
          validateSingle={validateSingle}
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
      <Divider />
      <Text type='secondary'>No account?</Text>
      <Button type='link' onClick={onSignupNowClick}>
        Sign up now
      </Button>
    </>
  );
};
