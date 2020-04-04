import React from 'react';
import { Title, Row, Col, Text, Flex } from '@sradevski/blocks-ui';
import { WalletOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useTranslation } from '../../common/i18n';
import {
  StorePaymentMethods,
  PaymentMethodNames,
} from '@sradevski/la-sdk/dist/models/storePaymentMethods';
import { sdk } from '@sradevski/la-sdk';
import { SelectableCard } from '../shared/SelectableCard';

interface SelectAddressProps {
  storePaymentMethods: StorePaymentMethods;
  paymentMethod: PaymentMethodNames;
  setPaymentMethod: (paymentMethod: PaymentMethodNames) => void;
}

export const SelectPaymentMethod = ({
  storePaymentMethods,
  paymentMethod,
  setPaymentMethod,
}: SelectAddressProps) => {
  const { t } = useTranslation();

  const iconsMap: { [key in PaymentMethodNames]: React.ReactNode } = {
    [sdk.storePaymentMethods.PaymentMethodNames.PAY_ON_DELIVERY]: (
      <WalletOutlined style={{ fontSize: 42 }} />
    ),
    [sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD]: (
      <CreditCardOutlined style={{ fontSize: 42 }} />
    ),
  };

  return (
    <>
      <Title level={3}>{t('payment.choosePaymentMethod')}</Title>
      <Row mt={3} align='top' justify='start' gutter={{ xs: 16, sm: 32 }}>
        {storePaymentMethods?.methods &&
          storePaymentMethods.methods.map(method => {
            return (
              <Col key={method.name} mb={4}>
                <SelectableCard
                  isChecked={paymentMethod === method.name}
                  size='small'
                  hoverable={true}
                  onClick={() => setPaymentMethod(method.name)}
                  width={180}
                >
                  <Flex
                    height={'100%'}
                    width={'100%'}
                    alignItems='center'
                    justifyContent='center'
                    flexDirection='column'
                  >
                    {iconsMap[method.name]}
                    <Text
                      style={{ textAlign: 'center' }}
                      mt={3}
                      type='secondary'
                    >
                      {t(`paymentMethodNames.${method.name}`)}
                    </Text>
                  </Flex>
                </SelectableCard>
              </Col>
            );
          })}
      </Row>
    </>
  );
};
