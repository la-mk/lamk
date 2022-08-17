import React from "react";
import { Flex, Heading, Image, Text } from "@la-mk/blocks-ui";
import { VariantName } from "./VariantName";
import { useTranslation } from "next-i18next";
import { getImageURL } from "../../../../hacks/imageUrl";
import { OrderItem } from "../../../../domain/order";
import { urls } from "../../../../tooling/url";
import { HoverableLink } from "../../../../components/HoverableLink";
import { Price } from "./ProductCard/Price";

export const ProductImageWithTitle = ({
  orderItem,
  storeId,
  currency,
  hideSummary,
  showQuantity,
  ...props
}: {
  orderItem: OrderItem;
  storeId: string;
  currency: string;
  hideSummary?: boolean;
  showQuantity?: boolean;
} & React.ComponentProps<typeof Flex>) => {
  const { t } = useTranslation("translation");
  return (
    <HoverableLink
      href={`${urls.products}/[pid]`}
      as={`${urls.products}/${orderItem.product._id}`}
    >
      <Flex minWidth={"200px"} align="center" justify="flex-start" {...props}>
        <Flex maxHeight={"8rem"} maxWidth={"8rem"} minWidth={"8rem"}>
          <Image
            height={90}
            getSrc={(params) =>
              getImageURL(orderItem.product.media[0]?._id, storeId, params)
            }
            alt={orderItem.product.name}
          />
        </Flex>
        <Flex ml={4} direction="column">
          <Heading mx={0} my={0} mb={3} as="h2" size="sm" noOfLines={2}>
            {orderItem.product.name}
            <VariantName t={t} attributes={orderItem.product.attributes} />
          </Heading>

          <Flex direction="row">
            {showQuantity && (
              <Text mr={1} color="mutedText.dark">
                {orderItem.quantity} x
              </Text>
            )}
            <Price
              minCalculatedPrice={orderItem.product.calculatedPrice ?? 0}
              maxCalculatedPrice={orderItem.product.calculatedPrice ?? 0}
              minPrice={orderItem.product.price}
              maxPrice={orderItem.product.price}
              currency={t(`currencies.${currency}`)}
            />
          </Flex>
        </Flex>
      </Flex>
    </HoverableLink>
  );
};
