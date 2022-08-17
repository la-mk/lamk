import React from "react";
import { Flex, Text, Button, Box, Divider } from "@la-mk/blocks-ui";
import { TFunction, useTranslation } from "next-i18next";
import { Store } from "../../../../domain/store";
import { OrderItem } from "../../../../domain/order";
import { ProductImageWithTitle } from "./ProductImageWithTitle";
import { Quantity } from "./Quantity";

const OrderProductListItem = ({
  item,
  store,
  currency,
  handleRemove,
  handleChangeItemQuantity,
  t,
}: Pick<
  OrderProductsListProps,
  "store" | "currency" | "handleChangeItemQuantity" | "handleRemove"
> & { item: OrderItem; t: TFunction }) => {
  return (
    <Flex
      key={item.product._id}
      width="100%"
      px={[2, 3, 3]}
      pt={5}
      mb={5}
      direction={["column", "row", "row"]}
      justify={["flex-start", "space-between", "space-between"]}
      align={["flex-start", "center", "center"]}
    >
      <ProductImageWithTitle
        orderItem={item}
        currency={currency}
        storeId={store._id}
        hideSummary
      />

      <Box width={["100%", "unset", "unset"]} mt={[3, 0, 0]}>
        {handleChangeItemQuantity ? (
          <Flex
            direction={["row", "column", "column"]}
            align={"center"}
            justify={["space-between", "flex-start", "flex-start"]}
          >
            <Box ml={["9rem", 0, 0]}>
              <Quantity
                stock={item?.product.stock ?? 0}
                quantity={item.quantity}
                handleChangeItemQuantity={(newQuantity) =>
                  handleChangeItemQuantity(item, newQuantity)
                }
              />
            </Box>
            <Button
              onClick={() => handleRemove?.(item)}
              mt={3}
              size="xs"
              variant="link"
            >
              Remove
            </Button>
          </Flex>
        ) : (
          <Text>
            <>
              {t("commerce.quantity")}: {item.quantity}
            </>
          </Text>
        )}
      </Box>

      <Box display={["none", "initial", "initial"]} mt={[3, 0, 0]}>
        <Text as="strong" color="mutedText.dark">
          <>
            {(item.product.calculatedPrice ?? 0) * item.quantity}{" "}
            {t(`currencies.${currency}`)}
          </>
        </Text>
      </Box>
    </Flex>
  );
};

export interface OrderProductsListProps {
  items: Array<OrderItem>;
  store: Store;
  currency: string;
  handleRemove?: (item: OrderItem) => void;
  handleChangeItemQuantity?: (item: OrderItem, newQuantity: number) => void;
}

export const OrderProductsList = ({
  items,
  currency,
  store,
  handleRemove,
  handleChangeItemQuantity,
}: OrderProductsListProps) => {
  const { t } = useTranslation("translation");
  return (
    <Flex width="100%" direction="column">
      <Box>
        <Flex
          minWidth={"18rem"}
          align="center"
          justify="center"
          direction="column"
        >
          {items.map((item, i) => (
            <React.Fragment key={i}>
              <Divider mb={2} />
              <OrderProductListItem
                store={store}
                currency={currency}
                handleRemove={handleRemove}
                handleChangeItemQuantity={handleChangeItemQuantity}
                item={item}
                t={t}
              />
            </React.Fragment>
          ))}
        </Flex>

        <Divider />
      </Box>
    </Flex>
  );
};
