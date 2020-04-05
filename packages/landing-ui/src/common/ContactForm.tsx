import React from 'react';
import {
  Col,
  Form,
  FormItem,
  formInput,
  Flex,
  Button,
  formTextArea,
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
        >
          <FormItem selector='name' label={'Full name'}>
            {formInput({ placeholder: 'John Doe' })}
          </FormItem>

          <FormItem selector='email' label={'Email address'}>
            {formInput({ placeholder: 'me@example.com' })}
          </FormItem>

          <FormItem selector='description' label={'Your business'}>
            {formTextArea({
              placeholder: 'Tell us about your business',
              autoSize: { minRows: 4, maxRows: 8 },
            })}
          </FormItem>

          <Flex justifyContent='center' alignItems='center'>
            <Button mr={2} type='primary' htmlType='submit'>
              Contact us
            </Button>
          </Flex>
        </Form>
      </Col>
    </>
  );
};
