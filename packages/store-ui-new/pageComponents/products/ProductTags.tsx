import { TFunction } from "next-i18next";
import { hooks, Flex, Tag } from "@la-mk/blocks-ui";
import { differenceInDays } from "date-fns";
import { Size } from "@la-mk/blocks-ui/dist/system";
import { useTheme } from "@chakra-ui/react";
import { Product } from "../../domain/product";

const NUM_DAYS_CONSIDER_AS_NEW = 10;

// TODO: Change bgColor for colorScheme
const ProductTag = ({ children, bg }: { children: string; bg: string }) => {
  const size = hooks.useBreakpoint<Size>(["md", "lg", "lg"]);

  return (
    <Tag
      // @ts-ignore
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      minWidth={"5rem"}
      size={size}
      mb={3}
      // @ts-ignore
      bgColor={bg}
    >
      {children}
    </Tag>
  );
};

export const ProductTags = ({
  t,
  product,
}: {
  t: TFunction;
  product: Product;
}) => {
  const theme = useTheme();
  const ownTheme = theme.sections.ProductCard.badge;

  const minDiscountPercentage = Math.round(
    ((product.minDiscount ?? 0) / (product.minPrice ?? 0)) * 100
  );
  const maxDiscountPercentage = Math.round(
    ((product.maxDiscount ?? 0) / (product.maxPrice ?? 0)) * 100
  );

  // min and max point to the products with min and max price, so any of the two can be larger.
  const discountPercentage = Math.max(
    minDiscountPercentage,
    maxDiscountPercentage
  );

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
        right: ownTheme.position === "right" ? 4 : undefined,
        left: ownTheme.position === "left" ? 4 : undefined,
        top: 12,
      }}
    >
      {isSoldOut && (
        <ProductTag bg={ownTheme.colors.soldOut}>
          {t("product.outOfStock")}
        </ProductTag>
      )}
      {!isSoldOut && isNew && (
        <ProductTag bg={ownTheme.colors.new}>{t("product.new")}</ProductTag>
      )}
      {!isSoldOut && discountPercentage > 0 && (
        <ProductTag bg={ownTheme.colors.discounted}>
          {t("product.discounted", { percentage: discountPercentage })}
        </ProductTag>
      )}
    </Flex>
  );
};
