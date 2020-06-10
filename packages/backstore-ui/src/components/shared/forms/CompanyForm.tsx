import React from 'react';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import {
  hooks,
  Form,
  FormItem,
  formInput,
  Flex,
  Button,
  Title,
  Box,
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from 'react-i18next';

export const CompanyForm = ({
  store,
  onDone,
}: {
  store: Partial<Store>;
  onDone: (store: Partial<Store>) => void;
}) => {
  const { t } = useTranslation();
  const [externalState] = hooks.useFormState<Partial<Store>>(store, {}, [
    store,
  ]);

  if (!store) {
    return null;
  }

  return (
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
      validate={sdk.store.validate}
      // TODO: Add single validation when the validation library can handle nested schemas/selectors.
      getErrorMessage={(errorName, context) =>
        t(`errors.${errorName}`, context)
      }
      externalState={externalState}
      onFormCompleted={onDone}
    >
      <FormItem selector='company.companyName' label={t('store.companyName')}>
        {formInput()}
      </FormItem>
      <FormItem
        selector='company.companyAddress'
        label={t('store.companyAddress')}
      >
        {formInput()}
      </FormItem>
      <FormItem
        selector='company.registryNumber'
        label={t('store.registryNumber')}
      >
        {formInput()}
      </FormItem>
      <FormItem selector='company.taxNumber' label={t('store.taxNumber')}>
        {formInput()}
      </FormItem>

      <Box mt={6} />

      <FormItem selector='contact.phoneNumber' label={t('common.phoneNumber')}>
        {formInput()}
      </FormItem>
      <FormItem
        selector='contact.alternatePhoneNumber'
        label={t('common.alternatePhoneNumber')}
      >
        {formInput()}
      </FormItem>
      <FormItem selector='contact.email' label={t('common.email')}>
        {formInput()}
      </FormItem>

      <Flex justifyContent='center' alignItems='center'>
        <Button mr={2} type='primary' htmlType='submit' size='large'>
          {t('actions.update')}
        </Button>
      </Flex>
    </Form>
  );
};
