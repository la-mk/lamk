import React from 'react';
import { Flex, Col, Form, FormItem, formInput, Button, Title } from '..';

export interface SignupProps {
  signup: (credentials: SignupCredentials) => void;
  validate: (data: SignupCredentials) => { [key: string]: string };
  validateSingle: (val: any, selector: string) => string;
}

export interface SignupCredentials {
  email: string;
  password: string;
}
export const SignupForm = ({
  signup,
  validate,
  validateSingle,
}: SignupProps) => {
  return (
    <Col width={['100%', '80%', '60%']}>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        layout='horizontal'
        colon={false}
        onFormCompleted={(data: SignupCredentials) => signup(data)}
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
            Signup
          </Button>
        </Flex>
      </Form>
    </Col>
  );
};
