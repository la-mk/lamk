import React from "react";
import { Text, Flex } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("translation");
  const discounted =
    minPrice !== minCalculatedPrice || maxPrice !== maxCalculatedPrice;

  const fontSize = size === "small" ? "sm" : size === "large" ? "xl" : "md";
  const pricePart = (
    <Text
      whiteSpace="nowrap"
      size={fontSize}
      color={discounted ? "danger" : "mutedText.dark"}
    >
      {minCalculatedPrice !== maxCalculatedPrice
        ? `${t("common.from")} ${minCalculatedPrice}`
        : minCalculatedPrice}{" "}
      {currency}
    </Text>
  );

  const discountedPart = discounted ? (
    <Text
      whiteSpace="nowrap"
      ml={3}
      as="s"
      color={"mutedText.light"}
      size={fontSize}
    >
      {minPrice !== maxPrice ? `${t("common.from")} ${minPrice}` : minPrice}{" "}
      {currency}
    </Text>
  ) : null;

  return (
    <Flex direction={vertical ? "column" : "row"} wrap="nowrap">
      {pricePart}
      {discountedPart}
    </Flex>
  );
};
