import React from 'react';
import { Heading, Text, Flex, Grid, Box } from '@sradevski/blocks-ui';
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
      <Heading as='h3' size='lg' color='text.dark'>
        {t('payment.choosePaymentMethod')}
      </Heading>
      <Grid mt={3} spacing={5} minChildWidth={[300, 360, 360]}>
        {storePaymentMethods?.methods &&
          storePaymentMethods.methods.map(method => {
            const isChecked = paymentMethod === method.name;
            return (
              <Box minWidth={[300, 360, 360]} maxWidth={480} width={'100%'}>
                <SelectableCard
                  isChecked={isChecked}
                  onClick={() => setPaymentMethod(method.name)}
                >
                  <Flex
                    height={'100%'}
                    width={'100%'}
                    align='center'
                    justify='center'
                  >
                    <Text color={isChecked ? 'heading.light' : 'heading.dark'}>
                      {iconsMap[method.name]}
                    </Text>

                    <Flex
                      ml={[3, 4, 4]}
                      direction='column'
                      align='center'
                      justify='center'
                    >
                      <Heading
                        m={0}
                        mb={2}
                        align='center'
                        as='h4'
                        size='sm'
                        color={isChecked ? 'heading.light' : 'heading.dark'}
                      >
                        {t(`paymentMethodNames.${method.name}`)}
                      </Heading>
                      <Text
                        size='sm'
                        color={isChecked ? 'heading.light' : 'heading.dark'}
                      >
                        {t(`paymentMethodNames.${method.name}Explanation`)}
                      </Text>
                    </Flex>
                  </Flex>
                </SelectableCard>
              </Box>
            );
          })}
      </Grid>
    </>
  );
};
