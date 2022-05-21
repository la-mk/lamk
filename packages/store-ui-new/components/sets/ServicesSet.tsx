import React from "react";
import { Flex, Text, Divider } from "@la-mk/blocks-ui";
import { TFunction, useTranslation } from "next-i18next";
import { useTheme } from "@chakra-ui/react";
import { Headphones } from "react-feather";
import { DeliveryTruck } from "../icons/DeliveryTruck";
import { SecurePayment } from "../icons/SecurePayment";
import { ReturnPolicy } from "../icons/ReturnPolicy";
import { Store } from "../../domain/store";
import { Delivery } from "../../domain/delivery";

interface Service {
  icon?: React.ReactElement;
  title: string;
  subtitle: string;
}

const variantColors = {
  rainbow: {
    background: [
      "primary.500",
      "background.light",
      "background.dark",
      "background.light",
    ],
    text: ["text.light", "text.dark", "text.light", "text.dark"],
  },
  dark: {
    background: [
      "background.dark",
      "background.dark",
      "background.dark",
      "background.dark",
    ],
    text: ["text.light", "text.light", "text.light", "text.light"],
  },
};

const getServices = (
  t: TFunction,
  store: Store,
  freeDeliveryPrice?: number
): Service[] => [
  ...(freeDeliveryPrice != undefined
    ? [
        {
          title: t("services.freeDelivery"),
          subtitle: `${t("services.freeDeliveryExplanation", {
            freeDeliveryPrice,
          })} ${t(`currencies.${store.preferences?.currency ?? "mkd"}`)}`,
          icon: <DeliveryTruck />,
        },
      ]
    : []),
  {
    title: t("services.securePayments"),
    subtitle: t("services.securePaymentsExplanation"),
    icon: <SecurePayment />,
  },
  {
    title: t("services.returnPolicy"),
    subtitle: t("services.returnPolicyExplanation"),
    icon: <ReturnPolicy />,
  },
  {
    title: t("services.support"),
    subtitle: t("services.supportExplanation"),
    icon: <Headphones />,
  },
];

export const ServicesSet = ({
  delivery,
  store,
}: {
  delivery?: Delivery;
  store: Store;
}) => {
  const theme = useTheme();
  const ownTheme = theme.sections.Services;
  const { t } = useTranslation();

  const colors = variantColors[ownTheme.variant as keyof typeof variantColors];
  const minWidth = Math.round(48 / ownTheme.count);
  const maxWidth = Math.round(70 / ownTheme.count);

  return (
    <Flex py={[1, 2, 3]} align="center" justify="center" wrap="wrap">
      {getServices(t, store, delivery?.freeDeliveryOver)
        .slice(0, ownTheme.count)
        .map((service, idx) => {
          return (
            <Flex
              key={service.title}
              flex={1}
              minWidth={`${minWidth}rem`}
              maxWidth={`${maxWidth}rem`}
              height={"10rem"}
              my={[3, 3, 2]}
              mx={[2, 3, 5]}
              bg={colors.background[idx]}
              // @ts-ignore
              borderRadius="md"
              align="center"
              justify="center"
              px={[3, 4, 4]}
            >
              {ownTheme.decoration === "icon" && (
                <Text lineHeight="none" mr={3} color={colors.text[idx]}>
                  {!!service.icon && service.icon}
                </Text>
              )}
              <Flex ml={2} py={4} direction="column">
                <Text
                  size={"2xl"}
                  color={colors.text[idx]}
                  // @ts-ignore
                  textTransform={ownTheme.textTransform}
                >
                  {service.title}
                </Text>
                {ownTheme.decoration === "divider" && <Divider my={2} />}
                <Text
                  size={"sm"}
                  color={colors.text[idx]}
                  // @ts-ignore
                  textTransform={ownTheme.textTransform}
                  noOfLines={2}
                >
                  {service.subtitle}
                </Text>
              </Flex>
            </Flex>
          );
        })}
    </Flex>
  );
};
