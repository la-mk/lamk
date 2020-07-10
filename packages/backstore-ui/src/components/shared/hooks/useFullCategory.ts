import { useState, useEffect, Dispatch } from 'react';
import { Category } from '@sradevski/la-sdk/dist/models/category';

export type FullCategory = [string, string, string];

export const useFullCategory = (
  categories: Category[] | null,
  productCategory: string | null | undefined,
): [FullCategory | undefined, Dispatch<FullCategory | undefined>] => {
  const [fullCategory, setFullCategory] = useState<FullCategory | undefined>();

  useEffect(() => {
    if (!categories || !productCategory) {
      setFullCategory(undefined);
      return;
    }

    const categorySet = categories.find(
      category => category.level3 === productCategory,
    );

    if (!categorySet) {
      setFullCategory(undefined);
      return;
    }

    setFullCategory([
      categorySet.level1,
      categorySet.level2,
      categorySet.level3,
    ]);
  }, [productCategory, categories]);

  return [fullCategory, setFullCategory];
};
