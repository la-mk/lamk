import React from 'react';
import { ProductCard } from '../shared/ProductCard';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Set } from '@sradevski/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { SetTitle } from './SetTitle';
import { SeeAllLink } from './SeeAllLink';

interface ProductSetProps {
  products: Product[];
  allHref: any;
  title: string;
  subtitle: string;
  storeId: string;
}

export const ProductSet = ({
  products,
  allHref,
  title,
  subtitle,
  storeId,
}: ProductSetProps) => {
  const { t } = useTranslation();
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
