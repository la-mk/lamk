import React, { useContext } from 'react';
import { formInput } from './FormHelpers';
import { Flex } from '../basic/Flex';
import { Col } from '../basic/Grid';
import {
  Form,
  FormItem,
  ValidationErrorResponse,
  SingleValidationErrorResponse,
} from '../basic/Form/Form';
import { Button } from '../basic/Button';
import { Text } from '../basic/Typography';
import { Divider } from '../basic/Divider';
import { LocalizationContext } from '../basic/Provider';

export interface LoginProps {
  login: (credentials: LoginCredentials) => void;
  onSignupNowClick: () => void;
  validate: (
    data: LoginCredentials,
  ) => ValidationErrorResponse | null | undefined;
  validateSingle: (
    val: any,
    selector: string,
  ) => SingleValidationErrorResponse | null | undefined;
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
  const localization = useContext(LocalizationContext);

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
          <FormItem
            selector='email'
            label={localization.email || 'Email address'}
          >
            {formInput()}
          </FormItem>

          <FormItem
            selector='password'
            label={localization.password || 'Password'}
          >
            {formInput({ type: 'password' })}
          </FormItem>

          <Flex justifyContent='center' alignItems='center'>
            <Button mr={2} type='primary' htmlType='submit' size='large'>
              {localization.login || 'Log in'}
            </Button>
          </Flex>
        </Form>
      </Col>
      <Divider />
      <Text type='secondary'>{localization.noAccount || 'No account?'}</Text>
      <Button type='link' onClick={onSignupNowClick}>
        {localization.signup || 'Sign up'}
      </Button>
    </>
  );
};
