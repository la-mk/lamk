import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import React, { useEffect, useState } from 'react';
import {
  Spinner,
  Flex,
  Box,
  toast,
  hooks,
  Button,
  NewForm,
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { useTranslation } from 'react-i18next';
import { StorePaymentMethods } from '@sradevski/la-sdk/dist/models/storePaymentMethods';

export const Payment = () => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const [
    paymentMethods,
    setPaymentMethods,
  ] = useState<StorePaymentMethods | null>(null);
  const store = useSelector(getStore);
  const storeId = store ? store._id : undefined;
  const [
    paymentMethodsFormData,
    setPaymentMethodsFormData,
  ] = hooks.useFormState(
    paymentMethods ? pick(paymentMethods, ['forStore', 'methods']) : undefined,
    { forStore: storeId, methods: [] },
    [paymentMethods],
  );

  useEffect(() => {
    if (storeId) {
      caller<FindResult<StorePaymentMethods>>(
        sdk.storePaymentMethods.findForStore(storeId),
        payment => {
          if (payment.total > 0) {
            return setPaymentMethods(payment.data[0]);
          }
        },
      );
    }
  }, [caller, storeId]);

  const handlePatchPaymentMethods = ({
    formData,
  }: {
    formData: StorePaymentMethods;
  }) => {
    if (!formData || !paymentMethods) {
      return;
    }

    caller<StorePaymentMethods>(
      sdk.storePaymentMethods.patch(paymentMethods._id, formData),
      updatedPaymentMethods => {
        toast.success(t('common.success'));
        return setPaymentMethods(updatedPaymentMethods);
      },
    );
  };

  const pickedSchema = cloneDeep(
    sdk.utils.schema.pick(sdk.storePaymentMethods.schema, [
      'forStore',
      'methods',
    ]),
  );
  // See https://github.com/rjsf-team/react-jsonschema-form/issues/902 why we can't use additionalProperties here.
  // delete pickedSchema.properties.methods.items.additionalProperties;

  pickedSchema.properties.methods.items.oneOf.forEach((entry: any) => {
    entry.title = t(`paymentMethodNames.${entry.properties.name.const}`);
    delete entry.additionaProperties;
  });

  return (
    <Flex direction='column' px={[3, 4, 5]} py={5}>
      <Spinner
        isLoaded={!showSpinner}
        label={t('payment.updatingPaymentMethodsTip')}
      >
        <Flex
          align='center'
          justify='center'
          direction='column'
          width={'100%'}
          maxWidth={800}
          minWidth={300}
          mx='auto'
        >
          <Box width='100%'>
            <NewForm<StorePaymentMethods>
              omitExtraData={false}
              schema={pickedSchema as any}
              uiSchema={{
                forStore: {
                  'ui:widget': 'hidden',
                },
                methods: {
                  items: {
                    name: {
                      'ui:widget': 'hidden',
                    },
                    processor: {
                      'ui:widget': 'select',
                      'ui:title': t('payment.processor'),
                      'ui:description': t('payment.processorMissingTip'),
                      'ui:options': {
                        customEnumOptions: Object.values(
                          sdk.storePaymentMethods.PaymentProcessors,
                        ).map(processor => ({
                          value: processor,
                          label: t(`paymentProcessors.${processor}`),
                        })),
                      },
                    },
                    clientId: {
                      'ui:title': t('payment.clientId'),
                      'ui:description': t('payment.clientIdTip'),
                    },
                    clientKey: {
                      'ui:widget': 'password',
                      'ui:title': t('payment.clientKey'),
                      'ui:description': t('payment.clientKeyTip'),
                    },
                    clientUsername: {
                      'ui:description': t('payment.clientUsernameTip'),
                      'ui:title': t('payment.clientUsername'),
                    },
                    clientPassword: {
                      'ui:widget': 'password',
                      'ui:title': t('payment.clientPassword'),
                      'ui:description': t('payment.clientPasswordTip'),
                    },
                  },
                },
              }}
              onSubmit={handlePatchPaymentMethods}
              onChange={({ formData }) => setPaymentMethodsFormData(formData)}
              formData={paymentMethodsFormData as StorePaymentMethods}
              getErrorMessage={(errorName, context) =>
                t(`errors.${errorName}`, context)
              }
            >
              <Button type='submit'>{t('actions.save')}</Button>
            </NewForm>
          </Box>
        </Flex>
      </Spinner>
    </Flex>
  );
};
