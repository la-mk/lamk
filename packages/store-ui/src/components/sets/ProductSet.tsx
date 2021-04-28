import React from 'react';
import { ProductCard } from '../shared/product/ProductCard';
import { Product, ProductSetResult } from '@la-mk/la-sdk/dist/models/product';
import { Set } from '@la-mk/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { SetTitle } from './SetTitle';
import { SeeAllLink } from './SeeAllLink';
import { getSetHref } from '../../common/filterUtils';
import { Store } from '@la-mk/la-sdk/dist/models/store';

interface ProductSetProps {
  set: ProductSetResult;
  store: Store;
}

export const ProductSet = ({ set, store }: ProductSetProps) => {
  const { t } = useTranslation();
  const allHref = getSetHref(set);
  const products = set.data;

  if (products?.length === 0) {
    return null;
  }

  return (
    <>
      <SetTitle title={set.setTag.title} subtitle={set.setTag.subtitle} />
      <Set
        itemKey={'_id'}
        items={products}
        renderItem={(product: Product) => (
          <ProductCard key={product._id} product={product} store={store} />
        )}
      />
      <SeeAllLink allHref={allHref} t={t} />
    </>
  );
};
