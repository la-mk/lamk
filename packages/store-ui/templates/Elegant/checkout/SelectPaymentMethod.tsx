import React from "react";
import { Heading, Text, Flex, Grid, Box } from "@la-mk/blocks-ui";
import {
  PaymentMethodNames,
  StorePaymentMethods,
} from "../../../domain/payment";
import { useTranslation } from "next-i18next";
import { SelectableCard } from "../components/SelectableCard";

interface SelectAddressProps {
  storePaymentMethods: StorePaymentMethods | undefined;
  paymentMethod: PaymentMethodNames | undefined;
  setPaymentMethod: (paymentMethod: PaymentMethodNames) => void;
}

export const SelectPaymentMethod = ({
  storePaymentMethods,
  paymentMethod,
  setPaymentMethod,
}: SelectAddressProps) => {
  const { t } = useTranslation("translation");
  return (
    <>
      <Heading mb={4} as="h3" size="md">
        {t("payment.choosePaymentMethod")}
      </Heading>

      {(storePaymentMethods?.methods?.length ?? 0) > 0 && (
        // @ts-ignore
        <Grid spacing={5} minChildWidth={["20rem", "24rem", "26rem"]}>
          {storePaymentMethods?.methods.map((method) => {
            const isChecked = paymentMethod === method.name;
            return (
              <Box
                key={method.name}
                maxWidth={["26rem", "30rem", "28rem"]}
                width={"100%"}
              >
                <SelectableCard
                  isChecked={isChecked}
                  onClick={() => setPaymentMethod(method.name)}
                  width="100%"
                >
                  <Flex
                    height={"100%"}
                    width={"100%"}
                    align="center"
                    justify="center"
                  >
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
                        color={"heading.dark"}
                      >
                        {t(`paymentMethodNames.${method.name}`)}
                      </Heading>
                      <Text align="center" size="sm" color={"mutedText.dark"}>
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
