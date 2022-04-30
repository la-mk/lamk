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
