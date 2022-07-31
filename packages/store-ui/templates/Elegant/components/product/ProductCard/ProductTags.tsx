import { TFunction } from "next-i18next";
import { Flex, Text } from "@la-mk/blocks-ui";
import { differenceInDays } from "date-fns";
import { Product } from "../../../../../domain/product";

const NUM_DAYS_CONSIDER_AS_NEW = 10;
export const ProductTags = ({
  t,
  product,
}: {
  t: TFunction;
  product: Product;
}) => {
  const isNew =
    differenceInDays(Date.now(), new Date(product.createdAt)) <
    NUM_DAYS_CONSIDER_AS_NEW;
  const isSoldOut = product.totalStock === 0;

  return (
    <Flex
      direction="column"
      align="flex-end"
      // @ts-ignore
      style={{
        position: "absolute",
        left: 32,
        top: 24,
      }}
    >
      {isSoldOut && (
        <Text as="strong" size="xs" textTransform={"uppercase"}>
          {t("product.outOfStock") as string}
        </Text>
      )}
      {!isSoldOut && isNew && (
        <Text as="strong" size="xs" textTransform={"uppercase"}>
          {t("product.new") as string}
        </Text>
      )}
    </Flex>
  );
};
