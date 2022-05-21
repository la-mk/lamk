import React from "react";
import { Heading, Text, Flex, Grid, Box } from "@la-mk/blocks-ui";
import { PaymentMethodNames, StorePaymentMethods } from "../../domain/payment";
import { useTranslation } from "next-i18next";
import { WalletMoney } from "../../components/icons/WalletMoney";
import { CreditCards } from "../../components/icons/CreditCards";
import { SelectableCard } from "../../components/SelectableCard";

interface SelectAddressProps {
  storePaymentMethods: StorePaymentMethods | undefined;
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
    [PaymentMethodNames.PAY_ON_DELIVERY]: <WalletMoney />,
    [PaymentMethodNames.CREDIT_CARD]: <CreditCards />,
  };

  return (
    <>
      <Heading mb={4} as="h3" size="md">
        {t("payment.choosePaymentMethod")}
      </Heading>

      {(storePaymentMethods?.methods?.length ?? 0) > 0 && (
        // @ts-ignore
        <Grid spacing={5} minChildWidth={["18rem", "20rem", "22rem"]}>
          {storePaymentMethods?.methods.map((method) => {
            const isChecked = paymentMethod === method.name;
            return (
              <Box
                key={method.name}
                minWidth={["18rem", "20rem", "22rem"]}
                maxWidth={"30rem"}
                width={"100%"}
              >
                <SelectableCard
                  isChecked={isChecked}
                  onClick={() => setPaymentMethod(method.name)}
                >
                  <Flex
                    height={"100%"}
                    width={"100%"}
                    align="center"
                    justify="center"
                  >
                    <Text color={isChecked ? "heading.light" : "heading.dark"}>
                      {iconsMap[method.name]}
                    </Text>

                    <Flex
                      ml={[4, 5, 5]}
                      direction="column"
                      align="center"
                      justify="center"
                    >
                      <Heading
                        m={0}
                        mb={2}
                        align="center"
                        as="h4"
                        size="sm"
                        color={isChecked ? "heading.light" : "heading.dark"}
                      >
                        {t(`paymentMethodNames.${method.name}`)}
                      </Heading>
                      <Text
                        align="center"
                        size="sm"
                        color={isChecked ? "heading.light" : "heading.dark"}
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
      )}
    </>
  );
};
