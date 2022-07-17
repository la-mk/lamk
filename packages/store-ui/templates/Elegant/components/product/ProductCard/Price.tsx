import React from "react";
import { Text, Flex } from "@la-mk/blocks-ui";

interface PriceProps {
  minCalculatedPrice: number;
  maxCalculatedPrice: number;
  minPrice: number;
  maxPrice: number;
  currency: string;
  size?: "small" | "default" | "large";
  vertical?: boolean;
}

export const Price = ({
  minCalculatedPrice,
  maxCalculatedPrice,
  minPrice,
  maxPrice,
  currency,
  size,
  vertical,
}: PriceProps) => {
  const discounted =
    minPrice !== minCalculatedPrice || maxPrice !== maxCalculatedPrice;

  const fontSize = size === "small" ? "sm" : size === "large" ? "xl" : "md";
  const pricePart = (
    <Text size={fontSize} color={discounted ? "danger" : "mutedText.dark"}>
      {minCalculatedPrice !== maxCalculatedPrice
        ? `From ${minCalculatedPrice}`
        : minCalculatedPrice}{" "}
      {currency}
    </Text>
  );

  const discountedPart = discounted ? (
    <Text ml={3} as="s" color={"mutedText.light"} size={fontSize}>
      {minPrice !== maxPrice ? `${minPrice} ~ ${maxPrice}` : minPrice}{" "}
      {currency}
    </Text>
  ) : null;

  return (
    <Flex direction={vertical ? "column" : "row"} wrap="wrap">
      {pricePart}
      {discountedPart}
    </Flex>
  );
};
