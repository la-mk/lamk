import React from "react";
import { Flex, Heading, Text, Box, Image } from "@la-mk/blocks-ui";
import { VariantName } from "./VariantName";
import { useTranslation } from "next-i18next";
import { HoverableLink } from "../HoverableLink";
import { getImageURL } from "../../hacks/imageUrl";
import { OrderItem } from "../../domain/order";

export const ProductImageWithTitle = ({
  orderItem,
  storeId,
  currency,
  hideSummary,
  ...props
}: {
  orderItem: OrderItem;
  storeId: string;
  currency: string;
  hideSummary?: boolean;
} & React.ComponentProps<typeof Flex>) => {
  const { t } = useTranslation("translation");
  return (
    <HoverableLink
      href="/products/[pid]"
      as={`/products/${orderItem.product._id}`}
    >
      <Flex minWidth={"200px"} align="center" justify="flex-start" {...props}>
        <Flex maxHeight={"90px"} maxWidth={"60px"} minWidth={"60px"}>
          <Image
            height={90}
            getSrc={(params) =>
              getImageURL(orderItem.product.media[0]?._id, storeId, params)
            }
            alt={orderItem.product.name}
          />
        </Flex>
        <Flex ml={4} direction="column">
          <Heading mx={0} my={0} as="h2" size="sm" noOfLines={2}>
            {orderItem.product.name}
            <VariantName t={t} attributes={orderItem.product.attributes} />
          </Heading>

          {!hideSummary && (
            <Box>
              <Text>{orderItem.quantity} x </Text>
              <Text as="strong">
                {orderItem.product.calculatedPrice}{" "}
                {t(`currencies.${currency}`)}
              </Text>
            </Box>
          )}
        </Flex>
      </Flex>
    </HoverableLink>
  );
};
