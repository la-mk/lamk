import { Product } from "./product";
import queryString from "qs";
import { urls } from "../tooling/url";

export enum ProductSetType {
  CATEGORY = "category",
  DISCOUNTED = "discounted",
  LATEST = "latest",
  GROUP = "group",
}

export interface ProductSet {
  title?: string;
  subtitle?: string;
  type: ProductSetType;
  value?: string;
  isPromoted: boolean;
}

export interface ProductSetResult {
  setTag: ProductSet;
  data?: Product[];
  error?: Error;
  filter?: {
    query: {
      [key: string]: any;
    };
  };
}

export const getTitleForSet = (setTag: Pick<ProductSet, "type" | "value">) => {
  switch (setTag.type) {
    case ProductSetType.CATEGORY:
      return `categories.${setTag.value}`;
    default:
      return `productSets.${setTag.type}`;
  }
};

export const getSubtitleForSet = (
  setTag: Pick<ProductSet, "type" | "value">
) => {
  switch (setTag.type) {
    case ProductSetType.CATEGORY:
      return `productSets.categoryExplanation`;
    default:
      return `productSets.${setTag.type}Explanation`;
  }
};

export const getFiltersFromSetQuery = (query: { [key: string]: any }) => {
  if (query.$sort) {
    const [field, order] = Object.entries(query.$sort)[0];
    return { s: { field, order: order === 1 ? "ascend" : "descend" } };
  }

  return { f: query };
};

export const getSetHref = (set: ProductSetResult) => {
  if (!set.filter) {
    return "";
  }

  return `${urls.products}?${queryString.stringify(
    getFiltersFromSetQuery(set.filter.query)
  )}`;
};
