import { TFunction } from 'next-i18next';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { hooks, Flex, Tag } from '@sradevski/blocks-ui';
import { differenceInDays } from 'date-fns';

const NUM_DAYS_CONSIDER_AS_NEW = 10;

export const ProductTags = ({
  t,
  product,
}: {
  t: TFunction;
  product: Product;
}) => {
  const compact = hooks.useBreakpoint([true, false, false]);

  const discountPercentage = Math.round(
    ((product.minDiscount ?? 0) / product.minPrice) * 100,
  );
  const isNew =
    differenceInDays(new Date(product.createdAt), Date.now()) >
    NUM_DAYS_CONSIDER_AS_NEW;
  const isSoldOut = product.totalStock === 0;

  return (
    <Flex
      flexDirection='column'
      alignItems='flex-end'
      style={{ position: 'absolute', right: 0, top: 12 }}
    >
      {isSoldOut && (
        <Tag minWidth='70px' compact={compact} mb={2} color='#043353'>
          {t('product.outOfStock')}
        </Tag>
      )}
      {!isSoldOut && isNew && (
        <Tag minWidth='70px' compact={compact} mb={2} color='#D9E93C'>
          {t('product.new')}
        </Tag>
      )}
      {!isSoldOut && discountPercentage > 0 && (
        <Tag minWidth='70px' compact={compact} mb={2} color='#FF3838'>
          {t('product.discounted', { percentage: discountPercentage })}
        </Tag>
      )}
    </Flex>
  );
};
