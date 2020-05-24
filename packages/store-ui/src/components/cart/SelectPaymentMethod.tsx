import React from 'react';
import { Title, Row, Col, Text, Flex } from '@sradevski/blocks-ui';
import { useTranslation } from '../../common/i18n';
import {
  StorePaymentMethods,
  PaymentMethodNames,
} from '@sradevski/la-sdk/dist/models/storePaymentMethods';
import { sdk } from '@sradevski/la-sdk';
import { SelectableCard } from '../shared/SelectableCard';
import { CreditCards } from '../shared/icons/CreditCards';
import { WalletMoney } from '../shared/icons/WalletMoney';

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
      <WalletMoney />
    ),
    [sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD]: <CreditCards />,
  };

  return (
    <>
      <Title level={3} fontSize={3} color='text.dark'>
        {t('payment.choosePaymentMethod')}
      </Title>
      <Row mt={3} align='top' justify='start' gutter={{ xs: 16, sm: 32 }}>
        {storePaymentMethods?.methods &&
          storePaymentMethods.methods.map(method => {
            const isChecked = paymentMethod === method.name;
            return (
              <Col key={method.name} mb={4}>
                <SelectableCard
                  isChecked={isChecked}
                  onClick={() => setPaymentMethod(method.name)}
                  minWidth={[320, 360, 420]}
                  maxWidth={520}
                  width={`${100 / storePaymentMethods.methods.length}%`}
                >
                  <Flex
                    height={'100%'}
                    width={'100%'}
                    alignItems='center'
                    justifyContent='center'
                  >
                    <Text color={isChecked ? 'heading.light' : 'heading.dark'}>
                      {iconsMap[method.name]}
                    </Text>

                    <Flex
                      ml={[3, 4, 4]}
                      flexDirection='column'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Title
                        m={0}
                        mb={2}
                        textAlign='center'
                        level={4}
                        fontSize={[2, 3, 3]}
                        color={isChecked ? 'heading.light' : 'heading.dark'}
                      >
                        {t(`paymentMethodNames.${method.name}`)}
                      </Title>
                      <Text
                        fontSize={[0, 1, 1]}
                        color={isChecked ? 'heading.light' : 'heading.dark'}
                      >
                        Blah some explanation
                      </Text>
                    </Flex>
                  </Flex>
                </SelectableCard>
              </Col>
            );
          })}
      </Row>
    </>
  );
};
