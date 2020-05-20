import React from 'react';
import { ProductCard } from '../shared/ProductCard';
import {
  Product,
  ProductSet as ProductSetType,
} from '@sradevski/la-sdk/dist/models/product';
import { Set } from '@sradevski/blocks-ui';
import { useTranslation, getTranslationBaseForSet } from '../../common/i18n';
import { SetTitle } from './SetTitle';
import { SeeAllLink } from './SeeAllLink';
import { getSetHref } from '../../common/filterUtils';

interface ProductSetProps {
  set: ProductSetType;
  storeId: string;
}

export const ProductSet = ({ set, storeId }: ProductSetProps) => {
  const { t } = useTranslation();
  const allHref = getSetHref(set);
  const products = set.data;
  const title = t(getTranslationBaseForSet(set.setTag));
  const subtitle = 'Best picks of the week';

  return (
    <>
      <SetTitle title={title} subtitle={subtitle} />
      <Set
        itemKey={'_id'}
        items={products}
        renderItem={(product: Product) => (
          <ProductCard key={product._id} product={product} storeId={storeId} />
        )}
      />
      <SeeAllLink allHref={allHref} t={t} />
    </>
  );
};
