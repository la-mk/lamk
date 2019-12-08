import { useState, useEffect, Dispatch } from 'react';
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { Product } from '@sradevski/la-sdk/dist/models/product';

export type FullCategory = [string, string, string];

export const useFullCategory = (
  categories: Category[] | null,
  product: Product | null | undefined,
): [FullCategory | undefined, Dispatch<FullCategory | undefined>] => {
  const [fullCategory, setFullCategory] = useState<FullCategory | undefined>();

  useEffect(() => {
    if (!categories || !product) {
      return;
    }

    const categorySet = categories.find(
      category => category.level3 === product.category,
    );

    if (!categorySet) {
      return;
    }

    setFullCategory([
      categorySet.level1,
      categorySet.level2,
      categorySet.level3,
    ]);
  }, [product, categories]);

  return [fullCategory, setFullCategory];
};
