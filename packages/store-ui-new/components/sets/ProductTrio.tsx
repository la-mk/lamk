import React from "react";
import { ProductSetResult } from "@la-mk/la-sdk/dist/models/product";
import { SetTitle } from "./SetTitle";
import { Flex, hooks, Box } from "@la-mk/blocks-ui";
import { Store } from "../../domain/store";
import { getSetHref } from "../../domain/set";
import { useTranslation } from "next-i18next";
import { ProductCard } from "../product/ProductCard";
import { SeeAllLink } from "./SeeAllLink";

interface ProductSetProps {
  set: ProductSetResult;
  store: Store;
}

export const ProductTrio = ({ set, store }: ProductSetProps) => {
  const { t } = useTranslation("translation");
  const areCardsHorizontal = hooks.useBreakpoint([false, false, true]);
  const areAllEmphasized = hooks.useBreakpoint([true, false, false]);

  const allHref = getSetHref(set);
  const products = set.data;

  if (!products) {
    return null;
  }

  const focusProduct = products[0];
  const productOne = products[1];
  const productTwo = products[2];

  return (
    <>
      <SetTitle title={set.setTag.title ?? ""} subtitle={set.setTag.subtitle} />
      <Flex
        align="center"
        justify="center"
        direction={["column", "column", "row"]}
      >
        <Box mr={[0, 0, 6]}>
          <ProductCard
            emphasized
            detailed
            product={focusProduct}
            store={store}
          />
        </Box>

        <Flex
          ml={[0, 0, 6]}
          direction={["column", "row", "column"]}
          align={["centar", "flex-start", "center"]}
          justify="center"
        >
          <Box mb={[0, 0, 4]} mr={[0, 4, 0]}>
            <ProductCard
              emphasized={areAllEmphasized}
              detailed
              horizontal={areCardsHorizontal}
              product={productOne}
              store={store}
            />
          </Box>
          <Box mt={[0, 0, 4]} ml={[0, 4, 0]}>
            <ProductCard
              emphasized={areAllEmphasized}
              detailed
              horizontal={areCardsHorizontal}
              product={productTwo}
              store={store}
            />
          </Box>
        </Flex>
      </Flex>
      <SeeAllLink allHref={allHref} t={t} />
    </>
  );
};
