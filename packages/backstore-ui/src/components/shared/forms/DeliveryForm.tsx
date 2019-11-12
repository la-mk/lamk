import React from "react";
import {
  FormItem,
  formInput,
  Form,
  Flex,
  Button,
  Select,
  Option
} from "@lamk/blocks-ui";
import { sdk } from "@lamk/la-sdk";
import { Delivery } from "@lamk/la-sdk/dist/models/delivery";
import { useTranslation } from "react-i18next";

interface DeliveryFormProps {
  delivery: Delivery | null;
  onDone: (delivery: Delivery) => void;
}

const deliveryOptions = ["pickup", "cargo-pickup", "door-to-door"];

export const DeliveryForm = ({ delivery, onDone }: DeliveryFormProps) => {
  const { t } = useTranslation();

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      layout="horizontal"
      colon={false}
      onFormCompleted={onDone}
      externalState={delivery || {}}
      validate={(data) => sdk.delivery.validate(data, Boolean(delivery))}
      validateSingle={sdk.delivery.validateSingle}
    >
      <FormItem selector="method" label={t("delivery.deliveryMethod")}>
        {(val, _onChange, onComplete) => (
          <Select value={val} onChange={onComplete}>
            {deliveryOptions.map(option => {
              return (
                <Option key={option} value={option}>
                  {t(`delivery.${option}`)}
                </Option>
              );
            })}
          </Select>
        )}
      </FormItem>
      <FormItem
        extra={t('delivery.priceExplanation')}
        selector="price"
        label={t('common.price')}
      >
        {formInput({ placeholder: t('common.price'), addonBefore: "Ден" })}
      </FormItem>

      <FormItem
        extra={t('delivery.freeDeliveryExplanation')}
        selector="freeDeliveryOver"
        label={t('delivery.freeDelivery')}
      >
        {formInput({ placeholder: t('delivery.overPrice'), addonBefore: "Ден" })}
      </FormItem>

      <Flex justifyContent="center" alignItems="center">
        <Button mr={2} type="primary" htmlType="submit" size="large">
          {delivery ? t('actions.update') : t('actions.save')}
        </Button>
      </Flex>
    </Form>
  );
};
