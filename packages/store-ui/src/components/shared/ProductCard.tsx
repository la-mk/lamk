import React from 'react';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import {
  Title,
  Flex,
  Image,
  Box,
  Tag,
  Paragraph,
  hooks,
} from '@sradevski/blocks-ui';
import Link from 'next/link';
import { Price } from './Price';
import { useTranslation } from '../../common/i18n';
import { differenceInDays } from 'date-fns';
import { TFunction } from 'next-i18next';

const NUM_DAYS_CONSIDER_AS_NEW = 10;

const Tags = ({ t, product }: { t: TFunction; product: Product }) => {
  const compact = hooks.useBreakpoint([true, false, false]);

  const discountPercentage = Math.round(
    ((product.discount ?? 0) / product.price) * 100,
  );
  const isNew =
    differenceInDays(new Date(product.createdAt), Date.now()) >
    NUM_DAYS_CONSIDER_AS_NEW;
  const isSoldOut = product.stock === 0;

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

const ProductDescription = ({
  product,
  detailed,
  emphasized,
}: {
  product: Product;
  detailed?: boolean;
  emphasized?: boolean;
  horizontal?: boolean;
}) => {
  return (
    <Box>
      <Title
        mb={2}
        level={3}
        fontSize={[1, 2, 2]}
        style={{ fontWeight: 'normal' }}
        ellipsis={{ rows: 2 }}
      >
        {product.name}
      </Title>

      {detailed && (
        <Paragraph
          fontSize={0}
          color='mutedText.dark'
          style={{ whiteSpace: 'pre-wrap' }}
          ellipsis={{ rows: 3 }}
        >
          {product.description}
        </Paragraph>
      )}

      <Price
        emphasized={emphasized}
        calculatedPrice={product.calculatedPrice}
        basePrice={product.price}
        currency={'ден'}
      />
    </Box>
  );
};

const ProductImage = ({
  storeId,
  product,
  emphasized,
  horizontal,
  t,
}: {
  storeId: string;
  product: Product;
  emphasized?: boolean;
  horizontal?: boolean;
  t: TFunction;
}) => {
  return (
    <Flex
      height={
        emphasized ? ['220px', '280px', '360px'] : ['120px', '140px', '180px']
      }
      width={horizontal ? ['160px', '240px', '280px'] : undefined}
      justifyContent='center'
      alignItems='center'
      style={{ position: 'relative' }}
      mb={horizontal ? 0 : 4}
      mr={horizontal ? 3 : 0}
    >
      <Tags t={t} product={product} />
      {/* <ActionsOverlay /> */}

      <Image
        height='100%'
        src={sdk.artifact.getUrlForArtifact(product.images[0], storeId)}
        alt={product.name}
      />
    </Flex>
  );
};

// const Fixed = styled(Flex)`
//   position: absolute;
//   top: 0;
//   left: 0;
//   bottom: 0;
//   right: 0;
// `;

// const Overlay = styled(Fixed)`
//   opacity: 0.7;
//   background: #ffffff;
//   transition: all 0.4s ease-in-out 0s;
// `;

// const ActionsOverlay = () => {
//   return (
//     <Fixed alignItems='center' justifyContent='center'>
//       <Overlay />
//       <Button size='large' mr={1} icon={<ZoomInOutlined />} />
//       <Button
//         size='large'
//         ml={1}
//         icon={<ShoppingCartOutlined />}
//         type='primary'
//       />
//     </Fixed>
//   );
// };

export const ProductCard = ({
  product,
  storeId,
  detailed,
  emphasized,
  horizontal,
}: {
  product: Product;
  storeId: string;
  detailed?: boolean;
  emphasized?: boolean;
  horizontal?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Link href='/products/[pid]' as={`/products/${product._id}`}>
      <a style={{ textDecoration: 'none' }}>
        <Flex
          flexDirection={horizontal ? 'row' : 'column'}
          p={[2, 3, 3]}
          my={2}
          width={
            horizontal && !emphasized
              ? ['320px', '460px', '560px']
              : emphasized
              ? ['260px', '360px', '440px']
              : ['160px', '240px', '280px']
          }
        >
          <ProductImage
            t={t}
            storeId={storeId}
            product={product}
            emphasized={emphasized}
            horizontal={horizontal}
          />

          <ProductDescription
            product={product}
            detailed={detailed}
            emphasized={emphasized}
          />
        </Flex>
      </a>
    </Link>
  );
};
