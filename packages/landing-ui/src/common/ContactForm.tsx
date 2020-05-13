import React, { useState } from 'react';
import {
  Col,
  Form,
  FormItem,
  formInput,
  Flex,
  Button,
  Result,
  formTextArea,
  message,
  Box,
} from '@sradevski/blocks-ui';
import { track } from './analytics';
import { AnalyticsEvents } from '@sradevski/analytics';
import { useTranslation } from './i18n';

interface ContactUs {
  email: string;
  name: string;
  message: string;
}

// Email validation from SDK, we don't use the SDK to keep the bundle small.
const regex =
  '[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*';
const tester = new RegExp(`^${regex}$`);

const validator = ({ email, name, message }: ContactUs) => {
  const res: any = {};

  if (!name) {
    res.name = { name: 'name', message: 'Name is required' };
  }

  if (!message) {
    res.message = { name: 'message', message: 'Message is required' };
  }

  if (!email) {
    res.email = { name: 'email', message: 'Email is required' };
  }

  if (!tester.test(email)) {
    res.email = {
      name: 'email',
      message: 'The field is not a valid email address',
    };
  }

  if (Object.keys(res).length <= 0) {
    return null;
  }

  return res;
};

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (data: ContactUs) => {
    setIsSubmitting(true);
    track(AnalyticsEvents.submitContactUs, {
      email: data.email,
    });

    fetch('https://api.la.mk/contactUs', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.code > 200) {
          message.error(resp.message);
        } else {
          setHasSubmitted(true);
        }
      })
      .catch((err) => message.error(err.message))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      <Col width={['100%', '90%', '80%']} mx='auto' style={{ zIndex: 3 }}>
        {hasSubmitted && (
          <Box bg='background.light' style={{ borderRadius: 12 }}>
            <Result
              status='success'
              title={t('landingContact.thanksForContact')}
              subTitle={t('landingContact.thanksForContactDetails')}
            />
          </Box>
        )}

        {!hasSubmitted && (
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
            onFormCompleted={handleSubmit}
            validate={validator}
            validateSingle={(val, selector) =>
              validator({ [selector]: val } as any)[selector]
            }
          >
            <FormItem selector='name' label={t('common.fullName')}>
              {formInput({ placeholder: t('landingContact.fullNameExample') })}
            </FormItem>

            <FormItem selector='email' label={t('common.email')}>
              {formInput({ placeholder: t('landingContact.emailExample') })}
            </FormItem>

            <FormItem selector='message' label={t('common.message')}>
              {formTextArea({
                placeholder: t('landingContact.messageExplanation'),
                autoSize: { minRows: 4, maxRows: 8 },
              })}
            </FormItem>

            <Flex justifyContent='center' alignItems='center'>
              <Button
                loading={isSubmitting}
                mr={2}
                type='primary'
                htmlType='submit'
              >
                {t('actions.contactUs')}
              </Button>
            </Flex>
          </Form>
        )}
      </Col>
    </>
  );
};
