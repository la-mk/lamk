import React from 'react';
import { Set } from '../../../blocks-ui/basic/Set';
import { CategoryCard } from '../shared/CategoryCard';

export const CategoriesSet = ({ categories }: { categories: any[] }) => {
  return (
    <>
      <Set
        itemKey={'_id'}
        items={categories}
        renderItem={(category: any) => (
          <CategoryCard key={category._id} category={category} />
        )}
      />
    </>
  );
};
