import React from "react";
import { Grid } from "@la-mk/blocks-ui";
import { ProductImageWithTitle } from "./ProductImageWithTitle";
import { OrderItem } from "../../../../domain/order";

export const SummaryProductList = ({
  items,
  storeId,
  currency,
}: {
  items: OrderItem[];
  storeId: string;
  currency: string;
}) => {
  return (
    // @ts-ignore
    <Grid spacing={5}>
      {items.map((item, i) => {
        return (
          <ProductImageWithTitle
            key={i}
            orderItem={item}
            storeId={storeId}
            currency={currency}
          />
        );
      })}
    </Grid>
  );
};
