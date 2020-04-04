import React from 'react';
import {
  Col,
  Form,
  FormItem,
  formInput,
  Flex,
  Button,
} from '@sradevski/blocks-ui';

export const ContactForm = () => {
  return (
    <>
      <Col width={['100%', '80%', '60%']}>
        <Form
          labelCol={{
            xs: { span: 24 },
            md: { span: 6 },
          }}
          wrapperCol={{
            xs: { span: 24 },
            md: { span: 12 },
          }}
          layout='horizontal'
          colon={false}
          onFormCompleted={(data: any) => null}
          // {...otherProps}
        >
          <FormItem selector='name' label={'Full name'}>
            {formInput()}
          </FormItem>

          <FormItem selector='email' label={'Email address'}>
            {formInput()}
          </FormItem>

          <FormItem selector='description' label={'Your business'}>
            {formInput()}
          </FormItem>

          <Flex justifyContent='center' alignItems='center'>
            <Button mr={2} type='primary' htmlType='submit' size='large'>
              Contact us
            </Button>
          </Flex>
        </Form>
      </Col>
    </>
  );
};
