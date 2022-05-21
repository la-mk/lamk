import React from "react";
import { Flex, Text, Button, Box, Table, Divider } from "@la-mk/blocks-ui";
import { TFunction, useTranslation } from "next-i18next";
import { Trash2 } from "react-feather";
import { TableColumnProps } from "@la-mk/blocks-ui/dist/basic/Table";
import { OrderedProduct } from "../../domain/product";
import { Store } from "../../domain/store";
import { Quantity } from "./Quantity";
import { Price } from "./Price";
import { OrderItem } from "../../domain/order";
import { ProductImageWithTitle } from "./ProductImageWithTitle";

const getColumns = (
  t: TFunction,
  store: Store,
  currency: string,
  handleChangeItemQuantity?: (
    product: OrderedProduct,
    quantity: number
  ) => void,
  handleRemove?: (product: OrderedProduct) => void
) =>
  [
    {
      title: t("commerce.product"),
      key: "product",
      render: (_text, item) => {
        return (
          <ProductImageWithTitle
            orderItem={item}
            currency={currency}
            storeId={store._id}
            hideSummary
          />
        );
      },
    },
    {
      title: t("common.price"),
      key: "price",
      render: (_val, item) => (
        <Price
          size="small"
          vertical
          minCalculatedPrice={item.product.calculatedPrice ?? 0}
          maxCalculatedPrice={item.product.calculatedPrice ?? 0}
          minPrice={item.product.price}
          maxPrice={item.product.price}
          currency={t(`currencies.${currency}`)}
        />
      ),
    },
    {
      title: t("commerce.quantity"),
      key: "quantity",
      render: (_val, item) =>
        handleChangeItemQuantity ? (
          <Quantity
            stock={item.product.stock ?? 999}
            quantity={item.quantity}
            handleChangeItemQuantity={(newQuantity) =>
              handleChangeItemQuantity(item.product, newQuantity)
            }
          />
        ) : (
          <Text color="heading.dark">{item.quantity}</Text>
        ),
    },
    {
      title: t("finance.total"),
      key: "total",
      isNumeric: true,
      render: (val, item) => (
        <Text as="strong" color="primary.500">
          <>
            {item.quantity * (item.product.calculatedPrice ?? 0)}{" "}
            {t(`currencies.${currency}`)}
          </>
        </Text>
      ),
    },
    ...(handleRemove
      ? [
          {
            key: "action",
            render: (_val: any, item: OrderedProduct) => (
              <Button
                variant="ghost"
                leftIcon={<Trash2 size="1.2rem" />}
                aria-label={t("actions.delete")}
                onClick={() => handleRemove(item)}
              />
            ),
          },
        ]
      : []),
  ] as TableColumnProps<OrderItem>[];

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
      direction="column"
      // @ts-ignore
      style={{ position: "relative" }}
    >
      {/* @ts-ignore */}
      <Box style={{ position: "absolute", top: 0, right: 0 }}>
        {handleRemove && (
          <Button
            variant="ghost"
            onClick={() => handleRemove(item.product)}
            leftIcon={<Trash2 size="1.2rem" />}
          />
        )}
      </Box>
      <ProductImageWithTitle
        orderItem={item}
        currency={currency}
        storeId={store._id}
        hideSummary
      />

      <Flex mt={6} justify="space-between">
        <Flex justify="center">
          <Text mr={2}>Price:</Text>
          <Price
            vertical
            minCalculatedPrice={item.product.calculatedPrice ?? 0}
            maxCalculatedPrice={item.product.calculatedPrice ?? 0}
            minPrice={item.product.price}
            maxPrice={item.product.price}
            currency={t(`currencies.${currency}`)}
          />
        </Flex>

        <Box>
          {handleChangeItemQuantity ? (
            <Quantity
              stock={item?.product.stock ?? 0}
              quantity={item.quantity}
              handleChangeItemQuantity={(newQuantity) =>
                handleChangeItemQuantity(item.product, newQuantity)
              }
            />
          ) : (
            <Text>
              <>
                {t("commerce.quantity")}: {item.quantity}
              </>
            </Text>
          )}
        </Box>
      </Flex>
      <Box mt={3}>
        <Text mr={2}>Total:</Text>
        <Text as="strong" color="primary">
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
  handleRemove?: (item: OrderedProduct) => void;
  handleChangeItemQuantity?: (item: OrderedProduct, val: number) => void;
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
      <Box display={["block", "block", "none"]}>
        <Flex
          minWidth={"18rem"}
          align="center"
          justify="center"
          direction="column"
        >
          {items.map((item) => (
            <>
              <Divider mb={2} />
              <OrderProductListItem
                store={store}
                currency={currency}
                handleRemove={handleRemove}
                handleChangeItemQuantity={handleChangeItemQuantity}
                item={item}
                t={t}
              />
            </>
          ))}
        </Flex>

        <Divider />
      </Box>

      <Box display={["none", "none", "block"]}>
        <Table
          data={items}
          // @ts-ignore
          columns={getColumns(
            t,
            store,
            currency,
            handleChangeItemQuantity,
            handleRemove
          )}
          rowKey="product._id"
        />
      </Box>
    </Flex>
  );
};
