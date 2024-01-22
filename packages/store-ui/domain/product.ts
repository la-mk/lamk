import { sdk } from "@la-mk/la-sdk";
import { Media } from "./media";

export interface Attributes {
  color?: string;
  size?: string;
}

export enum ProductUnit {
  ITEM = "item",
  PACK = "pack",
  M2 = "m2",
  M = "m",
  CM = "cm",
  MM = "mm",
  KG = "kg",
  G = "g",
}

export interface Product {
  _id: string;
  old_id?: string;
  soldBy: string;
  modifiedAt: string;
  createdAt: string;
  name: string;
  category: string;
  groups: string[];
  unit: ProductUnit;
  media: Media[];
  description?: string;
  variants: Variant[];
  discount?: number;
  totalStock?: number;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  maxDiscount?: number;
  minCalculatedPrice?: number;
  maxCalculatedPrice?: number;
}

export interface OrderedProduct {
  _id: string;
  item_id?: string;
  variant_id?: string;
  createdAt: string;
  modifiedAt: string;
  soldBy: string;
  unit: ProductUnit;
  name: string;
  category: string;
  groups: string[];
  media: Media[];
  description?: string;
  attributes?: Attributes;
  discount?: number;
  price: number;
  calculatedPrice?: number;
  stock?: number;
}

export interface Variant {
  _id: string;
  price: number;
  calculatedPrice?: number;
  attributes?: Attributes;
  discount?: number;
  sku?: string;
  stock?: number;
  // variantImage?: string;
}

export const getVariantForAttributes = (
  product: Product,
  attributes?: Attributes
) => sdk.product.getVariantForAttributes(product, attributes);

export const areAttributesEquivalent = (a?: Attributes, b?: Attributes) =>
  sdk.product.areAttributesEquivalent(a, b);

export const hasVariants = (product: Product) =>
  sdk.product.hasVariants(product);
