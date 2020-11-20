import React from 'react';
import {
  Heading,
  Row,
  Col,
  Paragraph,
  Flex,
  Label,
} from '@sradevski/blocks-ui';
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
      <Heading
        as='h3'
        size={['xsmall', 'small', 'small']}
        color='contentSecondary'
      >
        {t('payment.choosePaymentMethod')}
      </Heading>
      <Row mt={3} align='top' justify='start' gutter={{ xs: 16, sm: 32 }}>
        {storePaymentMethods?.methods &&
          storePaymentMethods.methods.map(method => {
            const isChecked = paymentMethod === method.name;
            return (
              <Col key={method.name} mb={4}>
                <SelectableCard
                  isChecked={isChecked}
                  onClick={() => setPaymentMethod(method.name)}
                  minWidth={[300, 380, 380]}
                  maxWidth={480}
                  width={`${100 / storePaymentMethods.methods.length}%`}
                >
                  <Flex
                    height={'100%'}
                    width={'100%'}
                    alignItems='center'
                    justifyContent='center'
                  >
                    <Label
                      color={
                        isChecked ? 'contentInversePrimary' : 'contentPrimary'
                      }
                    >
                      {iconsMap[method.name]}
                    </Label>

                    <Flex
                      ml={[3, 4, 4]}
                      flexDirection='column'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Heading
                        as='h4'
                        $style={{ lineHeight: 1 }}
                        m={0}
                        mb={3}
                        textAlign='center'
                        size={'small'}
                        color={
                          isChecked ? 'contentInversePrimary' : 'contentPrimary'
                        }
                      >
                        {t(`paymentMethodNames.${method.name}`)}
                      </Heading>
                      <Paragraph
                        size={['xsmall', 'small', 'small']}
                        color={
                          isChecked ? 'contentInversePrimary' : 'contentPrimary'
                        }
                      >
                        {t(`paymentMethodNames.${method.name}Explanation`)}
                      </Paragraph>
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
