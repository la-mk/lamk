import { useState, useEffect, Dispatch } from 'react';
import { Category } from '@sradevski/la-sdk/dist/models/category';

export type FullCategory = [string, string, string];

export const useFullCategory = (
  categories: Category[] | null,
  productCategory: string | null | undefined,
): [FullCategory | [], Dispatch<FullCategory | []>] => {
  const [fullCategory, setFullCategory] = useState<FullCategory | []>([]);

  useEffect(() => {
    if (!categories || !productCategory) {
      setFullCategory([]);
      return;
    }

    const categorySet = categories.find(
      category => category.level3 === productCategory,
    );

    if (!categorySet) {
      setFullCategory([]);
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
