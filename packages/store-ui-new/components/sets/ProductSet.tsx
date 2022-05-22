import React from "react";
import { Set } from "@la-mk/blocks-ui";
import { SetTitle } from "./SetTitle";
import { Store } from "../../domain/store";
import { getSetHref, ProductSetResult } from "../../domain/set";
import { ProductCard } from "../product/ProductCard";
import { SeeAllLink } from "./SeeAllLink";
import { useTranslation } from "next-i18next";
import { Product } from "../../domain/product";

interface ProductSetProps {
  set: ProductSetResult;
  store: Store;
}

export const ProductSet = ({ set, store }: ProductSetProps) => {
  const { t } = useTranslation("translation");
  const allHref = getSetHref(set);
  const products = set.data;

  if (products?.length === 0) {
    return null;
  }

  return (
    <>
      <SetTitle title={set.setTag.title ?? ""} subtitle={set.setTag.subtitle} />
      <Set
        itemKey={"_id"}
        items={products ?? []}
        renderItem={(product: Product) => (
          <ProductCard key={product._id} product={product} store={store} />
        )}
      />
      <SeeAllLink allHref={allHref} t={t} />
    </>
  );
};
