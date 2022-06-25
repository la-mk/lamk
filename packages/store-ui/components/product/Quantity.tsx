import React from "react";
import { Input } from "@la-mk/blocks-ui";

export const Quantity = ({
  stock,
  quantity,
  handleChangeItemQuantity,
}: {
  stock: number;
  quantity: number;
  handleChangeItemQuantity: (value: number) => void;
} & React.ComponentProps<typeof Input>) => {
  return (
    <Input
      type="number"
      width="5rem"
      min={1}
      max={stock || 9999}
      value={quantity}
      onChange={(_e, value) => handleChangeItemQuantity(value as number)}
    />
  );
};
