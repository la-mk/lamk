import { TFunction } from 'next-i18next';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { hooks, Flex, Tag } from '@sradevski/blocks-ui';
import { differenceInDays } from 'date-fns';
import { Size } from '@sradevski/blocks-ui/dist/system';

const NUM_DAYS_CONSIDER_AS_NEW = 10;

export const ProductTags = ({
  t,
  product,
}: {
  t: TFunction;
  product: Product;
}) => {
  const size = hooks.useBreakpoint<Size>(['md', 'lg', 'lg']);

  const minDiscountPercentage = Math.round(
    ((product.minDiscount ?? 0) / product.minPrice) * 100,
  );
  const maxDiscountPercentage = Math.round(
    ((product.maxDiscount ?? 0) / product.maxPrice) * 100,
  );

  // min and max point to the products with min and max price, so any of the two can be larger.
  const discountPercentage = Math.max(
    minDiscountPercentage,
    maxDiscountPercentage,
  );

  const isNew =
    differenceInDays(Date.now(), new Date(product.createdAt)) <
    NUM_DAYS_CONSIDER_AS_NEW;
  const isSoldOut = product.totalStock === 0;

  return (
    <Flex
      direction='column'
      align='flex-end'
      // @ts-ignore
      style={{ position: 'absolute', right: 4, top: 12 }}
    >
      {/* TODO: Change bgColor for colorScheme */}
      {isSoldOut && (
        // @ts-ignore
        <Tag minWidth='70px' size={size} mb={2} bgColor='#043353'>
          {t('product.outOfStock')}
        </Tag>
      )}
      {!isSoldOut && isNew && (
        // @ts-ignore
        <Tag minWidth='70px' size={size} mb={2} bgColor='#D9E93C'>
          {t('product.new')}
        </Tag>
      )}
      {!isSoldOut && discountPercentage > 0 && (
        // @ts-ignore
        <Tag minWidth='70px' size={size} mb={2} bgColor='#FF3838'>
          {t('product.discounted', { percentage: discountPercentage })}
        </Tag>
      )}
    </Flex>
  );
};
