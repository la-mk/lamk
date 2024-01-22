import React from "react";
import { Flex, Box, Heading, Text, Button } from "@la-mk/blocks-ui";
import Link from "next/link";
import { Eye } from "react-feather";
import { formatDistanceToNow } from "date-fns";
import { mk, enUS } from "date-fns/locale";
import { Order } from "../../../../domain/order";
import { Store } from "../../../../domain/store";
import { useTranslation } from "next-i18next";
import { OrderProductsList } from "../../components/product/OrderProductsList";
import { sdk } from "../../../../sdk/sdk";
import { urls } from "../../../../tooling/url";

export const OrderDescription = ({
  order,
  store,
  hideDetailsButton,
}: {
  order: Order;
  store: Store;
  hideDetailsButton?: boolean;
}) => {
  const { t, i18n } = useTranslation("translation");

  return (
    <>
      <Flex
        mx={[2, 2, 6]}
        mt={4}
        mb={6}
        direction="row"
        align="center"
        justify="space-between"
      >
        <Flex align="center" justify="center">
          <Box display={["none", "none", "initial"]}>
            <Heading m={0} mr={4} as="h2" size="md">
              {`${t("pages.order")} - ${
                order.orderNumber
                  ? `#${order.orderNumber}`
                  : sdk.utils.getShortId(order._id)
              }`}
            </Heading>
          </Box>
          {/* TODO: Standardize this and add to blocks-ui */}
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <circle
              cx="3"
              cy="3"
              r="3"
              fill={sdk.order.statusColor[order.status]}
            />
          </svg>
          <Text color={sdk.order.statusColor[order.status]} ml={1} size="sm">
            {t(`orderStatus.${order.status}`)}
          </Text>
        </Flex>
        {!hideDetailsButton && (
          <Link
            passHref
            href={`${urls.accountOrders}/[oid]`}
            as={`${urls.accountOrders}/${order._id}`}
          >
            <Button as="a" variant="link" leftIcon={<Eye size="1.2rem" />}>
              {t("common.details")}
            </Button>
          </Link>
        )}
      </Flex>

      <OrderProductsList
        items={order.ordered}
        currency={order.currency}
        store={store}
      />

      <Flex mt={2} px={[1, 1, 2]} justify="space-between" align="center">
        <Text mr={2} size="sm" color="mutedText.dark">
          {/* TODO: Show expected delivery */}
          {/* Expected delivery between 1 and 2 */}
        </Text>
        <Text ml={2} size="sm" color="mutedText.dark">
          {t("order.ordered")}{" "}
          {formatDistanceToNow(new Date(order.createdAt), {
            // TODO: Handle locales better
            locale: i18n.language === "mk" ? mk : enUS,
            addSuffix: true,
          })}
        </Text>
      </Flex>
    </>
  );
};
