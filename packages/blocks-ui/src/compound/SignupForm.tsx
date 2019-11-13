import React, { useContext } from 'react';
import { formInput } from './FormHelpers';
import { Flex } from '../basic/Flex';
import { Col } from '../basic/Grid';
import { Form, FormItem, FormHandlers } from '../basic/Form/Form';
import { Button } from '../basic/Button';
import { Text } from '../basic/Typography';
import { Divider } from '../basic/Divider';
import { LocalizationContext } from '../basic/Provider';

export interface SignupProps extends FormHandlers {
  signup: (credentials: SignupCredentials) => void;
  onLoginNowClick: () => void;
}

export interface SignupCredentials {
  email: string;
  password: string;
}
export const SignupForm = ({
  signup,
  onLoginNowClick,
  ...otherProps
}: SignupProps) => {
  const localization = useContext(LocalizationContext);

  return (
    <>
      <Col width={['100%', '80%', '60%']}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          layout='horizontal'
          colon={false}
          onFormCompleted={(data: SignupCredentials) => signup(data)}
          {...otherProps}
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
              {localization.signup || 'Sign up'}
            </Button>
          </Flex>
        </Form>
      </Col>
      <Divider />
      <Text type='secondary'>
        {localization.alreadyHaveAccount || 'Already have an account?'}
      </Text>
      <Button type='link' onClick={onLoginNowClick}>
        {localization.login || 'login'}
      </Button>
    </>
  );
};
