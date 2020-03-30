import React, { useEffect, useState } from 'react';
import {
  Spin,
  Col,
  Title,
  Flex,
  message,
  hooks,
  Button,
  Form,
  Row,
  FormItem,
  Checkbox,
  Option,
  Input,
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getStore } from '../../../state/modules/store/store.selector';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { useTranslation } from 'react-i18next';
import {
  StorePaymentMethods,
  PaymentMethod,
  PaymentMethodNames,
  PaymentProcessors,
} from '@sradevski/la-sdk/dist/models/storePaymentMethods';
import { Select } from 'antd';

const getUpdatedMethods = (
  oldMethods: PaymentMethod[],
  isNewChecked: boolean,
  methodName: PaymentMethodNames,
) => {
  const filteredMethods = oldMethods.filter(
    method => method.name !== methodName,
  );

  if (isNewChecked) {
    return [
      ...filteredMethods,
      {
        name: methodName,
      },
    ];
  }

  return filteredMethods;
};

//TODO: Cleanup the payment form and handle nested schemas better.

export const Payment = () => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const [
    paymentMethods,
    setPaymentMethods,
  ] = useState<StorePaymentMethods | null>(null);
  const store = useSelector(getStore);
  const storeId = store ? store._id : undefined;
  const [externalState, setExternalState] = useState<Partial<
    StorePaymentMethods
  > | null>(paymentMethods ?? { forStore: storeId, methods: [] });

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

  useEffect(() => {
    if (!paymentMethods) {
      return;
    }
    setExternalState(paymentMethods);
  }, [paymentMethods]);

  const handlePatchPaymentMethods = (
    updatedPaymentMethods?: StorePaymentMethods,
  ) => {
    if (
      !updatedPaymentMethods ||
      isEqual(paymentMethods, updatedPaymentMethods)
    ) {
      return;
    }

    caller<StorePaymentMethods>(
      sdk.storePaymentMethods.patch(
        updatedPaymentMethods._id,
        updatedPaymentMethods,
      ),
      paymentMethods => {
        message.success(t('common.success'));
        return setPaymentMethods(paymentMethods);
      },
    );
  };

  return (
    <Flex flexDirection='column' px={[3, 3, 4]} py={2}>
      <Title mb={3} level={2}>
        {t('commerce.payment')}
      </Title>
      <Col my={3}>
        <Spin
          spinning={showSpinner}
          tip={t('payment.updatingPaymentMethodsTip')}
        >
          <Form
            labelCol={{
              xs: { span: 24 },
              md: { span: 6 },
            }}
            wrapperCol={{
              xs: { span: 24 },
              md: { span: 12 },
            }}
            colon={false}
            externalState={externalState}
            validate={sdk.storePaymentMethods.validate}
            // TODO: Add single validation when the validation library can handle nested schemas/selectors.
            getErrorMessage={(errorName, context) =>
              t(`errors.${errorName}`, context)
            }
            onFormCompleted={handlePatchPaymentMethods}
            layout='horizontal'
          >
            <Row gutter={24}>
              <FormItem label={' '} selector='methods'>
                {(
                  _val: any,
                  _onChange: (val: any) => void,
                  onComplete: (val: any) => void,
                  { methods }: StorePaymentMethods,
                ) => (
                  <Checkbox
                    mr={3}
                    checked={(methods ?? []).some(
                      method =>
                        method.name ===
                        sdk.storePaymentMethods.PaymentMethodNames
                          .PAY_ON_DELIVERY,
                    )}
                    onChange={e => {
                      const isChecked = e.target.checked;
                      onComplete(
                        getUpdatedMethods(
                          methods ?? [],
                          isChecked,
                          sdk.storePaymentMethods.PaymentMethodNames
                            .PAY_ON_DELIVERY,
                        ),
                      );
                    }}
                  >
                    {t(
                      `paymentMethodNames.${sdk.storePaymentMethods.PaymentMethodNames.PAY_ON_DELIVERY}`,
                    )}
                  </Checkbox>
                )}
              </FormItem>
            </Row>

            <Row gutter={24}>
              <FormItem label={' '} selector='methods'>
                {(
                  _val: PaymentMethod[] | undefined,
                  _onChange: (val: any) => void,
                  onComplete: (val: any) => void,
                  { methods }: StorePaymentMethods,
                ) => (
                  <Checkbox
                    mr={3}
                    checked={(methods ?? []).some(
                      method =>
                        method.name ===
                        sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD,
                    )}
                    onChange={e => {
                      const isChecked = e.target.checked;
                      onComplete(
                        getUpdatedMethods(
                          methods ?? [],
                          isChecked,
                          sdk.storePaymentMethods.PaymentMethodNames
                            .CREDIT_CARD,
                        ),
                      );
                    }}
                  >
                    {t(
                      `paymentMethodNames.${sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD}`,
                    )}
                  </Checkbox>
                )}
              </FormItem>
            </Row>

            <Row gutter={24}>
              <FormItem
                label={t('payment.processor')}
                help={t('payment.processorMissingTip')}
                // In order to not show errors/checkmarks here due to the nested nature of the schema, we just don't rely on the selector.
                selector='methods'
              >
                {(
                  _val: PaymentMethod[] | undefined,
                  _onChange: (val: any) => void,
                  onComplete: (val: any) => void,
                  { methods }: StorePaymentMethods,
                ) => {
                  return (
                    <Select<PaymentProcessors>
                      disabled={
                        !(methods ?? []).some(
                          method =>
                            method.name ===
                            sdk.storePaymentMethods.PaymentMethodNames
                              .CREDIT_CARD,
                        )
                      }
                      value={
                        (methods ?? []).find(
                          method =>
                            method.processor ===
                            sdk.storePaymentMethods.PaymentProcessors.HALKBANK,
                        )?.processor
                      }
                      onChange={processor => {
                        onComplete(
                          methods?.map(method =>
                            method.name ===
                            sdk.storePaymentMethods.PaymentMethodNames
                              .CREDIT_CARD
                              ? { ...method, processor }
                              : method,
                          ),
                        );
                      }}
                    >
                      {Object.values(
                        sdk.storePaymentMethods.PaymentProcessors,
                      ).map(option => {
                        return (
                          <Option key={option} value={option}>
                            {t(`paymentProcessors.${option}`)}
                          </Option>
                        );
                      })}
                    </Select>
                  );
                }}
              </FormItem>
            </Row>

            <Row gutter={24}>
              <FormItem
                label={t('payment.clientUsername')}
                help={t('payment.clientUsernameTip')}
                selector='methods'
              >
                {(
                  _val: PaymentMethod[],
                  onChange: (val: any) => void,
                  onComplete: (val: any) => void,
                  { methods }: StorePaymentMethods,
                ) => (
                  <Input
                    disabled={
                      !(methods ?? []).some(
                        method =>
                          method.name ===
                            sdk.storePaymentMethods.PaymentMethodNames
                              .CREDIT_CARD && Boolean(method.processor),
                      )
                    }
                    value={
                      methods?.find(
                        method =>
                          method.name ===
                          sdk.storePaymentMethods.PaymentMethodNames
                            .CREDIT_CARD,
                      )?.clientUsername
                    }
                    onChange={e => {
                      onChange(
                        methods?.map(method =>
                          method.name ===
                          sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD
                            ? { ...method, clientUsername: e.target.value }
                            : method,
                        ),
                      );
                    }}
                    onBlur={e => {
                      onComplete(
                        methods?.map(method =>
                          method.name ===
                          sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD
                            ? { ...method, clientUsername: e.target.value }
                            : method,
                        ),
                      );
                    }}
                  />
                )}
              </FormItem>
            </Row>

            <Row gutter={24}>
              <FormItem
                label={t('payment.clientPassword')}
                help={t('payment.clientPasswordTip')}
                selector='methods'
              >
                {(
                  _val: PaymentMethod[],
                  onChange: (val: any) => void,
                  onComplete: (val: any) => void,
                  { methods }: StorePaymentMethods,
                ) => (
                  <Input
                    disabled={
                      !(methods ?? []).some(
                        method =>
                          method.name ===
                            sdk.storePaymentMethods.PaymentMethodNames
                              .CREDIT_CARD && Boolean(method.processor),
                      )
                    }
                    value={
                      methods?.find(
                        method =>
                          method.name ===
                          sdk.storePaymentMethods.PaymentMethodNames
                            .CREDIT_CARD,
                      )?.clientPassword
                    }
                    onChange={e => {
                      onChange(
                        methods?.map(method =>
                          method.name ===
                          sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD
                            ? { ...method, clientPassword: e.target.value }
                            : method,
                        ),
                      );
                    }}
                    onBlur={e => {
                      onComplete(
                        methods?.map(method =>
                          method.name ===
                          sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD
                            ? { ...method, clientPassword: e.target.value }
                            : method,
                        ),
                      );
                    }}
                  />
                )}
              </FormItem>
            </Row>

            <Row gutter={24}>
              <FormItem
                label={t('payment.clientId')}
                help={t('payment.clientIdTip')}
                selector='methods'
              >
                {(
                  _val: PaymentMethod[],
                  onChange: (val: any) => void,
                  onComplete: (val: any) => void,
                  { methods }: StorePaymentMethods,
                ) => (
                  <Input
                    disabled={
                      !(methods ?? []).some(
                        method =>
                          method.name ===
                            sdk.storePaymentMethods.PaymentMethodNames
                              .CREDIT_CARD && Boolean(method.processor),
                      )
                    }
                    value={
                      methods?.find(
                        method =>
                          method.name ===
                          sdk.storePaymentMethods.PaymentMethodNames
                            .CREDIT_CARD,
                      )?.clientId
                    }
                    onChange={e => {
                      onChange(
                        methods?.map(method =>
                          method.name ===
                          sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD
                            ? { ...method, clientId: e.target.value }
                            : method,
                        ),
                      );
                    }}
                    onBlur={e => {
                      onComplete(
                        methods?.map(method =>
                          method.name ===
                          sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD
                            ? { ...method, clientId: e.target.value }
                            : method,
                        ),
                      );
                    }}
                  />
                )}
              </FormItem>
            </Row>

            <Row gutter={24}>
              <FormItem
                label={t('payment.clientKey')}
                help={t('payment.clientKeyTip')}
                selector='methods'
              >
                {(
                  _val: PaymentMethod[],
                  onChange: (val: any) => void,
                  onComplete: (val: any) => void,
                  { methods }: StorePaymentMethods,
                ) => (
                  <Input
                    disabled={
                      !(methods ?? []).some(
                        method =>
                          method.name ===
                            sdk.storePaymentMethods.PaymentMethodNames
                              .CREDIT_CARD && Boolean(method.processor),
                      )
                    }
                    value={
                      methods?.find(
                        method =>
                          method.name ===
                          sdk.storePaymentMethods.PaymentMethodNames
                            .CREDIT_CARD,
                      )?.clientKey
                    }
                    onChange={e => {
                      onChange(
                        methods?.map(method =>
                          method.name ===
                          sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD
                            ? { ...method, clientKey: e.target.value }
                            : method,
                        ),
                      );
                    }}
                    onBlur={e => {
                      onComplete(
                        methods?.map(method =>
                          method.name ===
                          sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD
                            ? { ...method, clientKey: e.target.value }
                            : method,
                        ),
                      );
                    }}
                  />
                )}
              </FormItem>
            </Row>

            <Flex justifyContent='center' alignItems='center'>
              <Button mr={2} type='primary' htmlType='submit' size='large'>
                {t('actions.save')}
              </Button>
            </Flex>
          </Form>
        </Spin>
      </Col>
    </Flex>
  );
};
