import React, { useState } from 'react';
import { Button, Result, toast, Box, NewForm } from '@sradevski/blocks-ui';
import { track } from './analytics';
import { AnalyticsEvents } from '@sradevski/analytics';
import { useTranslation } from './i18n';

interface ContactUs {
  email: string;
  name: string;
  message: string;
}

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = ({ formData, ...rest }: { formData: ContactUs }) => {
    setIsSubmitting(true);
    track(AnalyticsEvents.submitContactUs, {
      email: formData.email,
    });

    fetch('https://api.la.mk/contactUs', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(resp => resp.json())
      .then(resp => {
        if (resp.code > 200) {
          toast.error(resp.message);
        } else {
          setHasSubmitted(true);
        }
      })
      .catch(err => toast.error(err.message))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      {/* @ts-ignore */}
      <Box width={['90%', '60%', '40%']} mx='auto' style={{ zIndex: 3 }}>
        {hasSubmitted && (
          // @ts-ignore
          <Box bg='background.light' borderRadius={'md'}>
            <Result
              status='success'
              title={t('landingContact.thanksForContact')}
              description={t('landingContact.thanksForContactDetails')}
            />
          </Box>
        )}

        {!hasSubmitted && (
          <NewForm
            schema={{
              // We don't use the SDK here just to keep the bundle smaller
              type: 'object',
              required: ['name', 'email', 'message'],
              properties: {
                name: {
                  type: 'string',
                  minLength: 2,
                  maxLength: 255,
                },
                email: {
                  type: 'string',
                  format: 'email',
                },
                message: {
                  type: 'string',
                  minLength: 8,
                  maxLength: 4095,
                },
              },
            }}
            uiSchema={{
              name: {
                'ui:title': t('common.fullName'),
                'ui:placeholder': t('landingContact.fullNameExample'),
              },
              email: {
                'ui:title': t('common.email'),
                'ui:placeholder': t('landingContact.emailExample'),
              },
              message: {
                'ui:widget': 'textarea',
                'ui:title': t('common.message'),
                'ui:placeholder': t('landingContact.messageExplanation'),
                'ui:options': {
                  rows: 6,
                },
              },
            }}
            onSubmit={handleSubmit}
            getErrorMessage={(errorName, context) =>
              t(`errors.${errorName}`, context)
            }
          >
            <Button
              size='lg'
              isLoading={isSubmitting}
              variant='solid'
              type='submit'
            >
              {t('actions.contactUs')}
            </Button>
          </NewForm>
        )}
      </Box>
    </>
  );
};
