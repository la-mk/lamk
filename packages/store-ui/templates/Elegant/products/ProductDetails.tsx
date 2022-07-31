import React from "react";
import { Box, Text } from "@la-mk/blocks-ui";
import { Store } from "../../../domain/store";
import { Product } from "../../../domain/product";
import { Delivery } from "../../../domain/delivery";
import { useTranslation } from "next-i18next";

export const ProductDetails = ({
  product,
  delivery,
  store,
}: {
  store: Store;
  product: Product;
  delivery?: Delivery;
}) => {
  const { t } = useTranslation("translation");
  const deliveryPrice = delivery?.price;
  const freeDeliveryPrice = delivery?.freeDeliveryOver;

  return (
    <>
      <Text as="p" whiteSpace="pre-wrap">
        {product.description?.trim()}
      </Text>
      <Box mt={7}>
        {!!delivery?.method && (
          <>
            <Text as="strong" whiteSpace="pre-wrap">
              {t(`deliveryMethods.${delivery.method}`)}
            </Text>

            <Text as="p" whiteSpace="pre-wrap">
              {t("delivery.ordersBelowFreeDelivery")} {freeDeliveryPrice}{" "}
              {t(`currencies.${store.preferences?.currency ?? "mkd"}`)}:{" "}
              {deliveryPrice}{" "}
              {t(`currencies.${store.preferences?.currency ?? "mkd"}`)}
            </Text>

            <Text as="p" whiteSpace="pre-wrap">
              {t("delivery.ordersAboveFreeDelivery")} {freeDeliveryPrice}{" "}
              {t(`currencies.${store.preferences?.currency ?? "mkd"}`)}:{" "}
              {t("delivery.freeDelivery")}
            </Text>
          </>
        )}
      </Box>
    </>
  );
};
