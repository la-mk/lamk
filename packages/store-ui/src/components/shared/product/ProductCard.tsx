import React from 'react';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import { Heading, Flex, Box, Image, Text } from '@sradevski/blocks-ui';
import { Price } from './Price';
import { useTranslation } from '../../../common/i18n';

import { TFunction } from 'next-i18next';
import { HoverableLink } from '../components/HoverableLink';
import { ProductTags } from './ProductTags';

const ProductDescription = ({
  product,
  detailed,
  horizontal,
  emphasized,
}: {
  product: Product;
  detailed?: boolean;
  emphasized?: boolean;
  horizontal?: boolean;
}) => {
  return (
    <Box py={horizontal ? 5 : 0}>
      <Heading mb={2} as='h3' size='sm' noOfLines={2}>
        {product.name}
      </Heading>

      {detailed && (
        <Text as='p' color='mutedText.dark' whiteSpace='pre-wrap' noOfLines={3}>
          {product.description}
        </Text>
      )}

      <Price
        minCalculatedPrice={product.minCalculatedPrice}
        maxCalculatedPrice={product.maxCalculatedPrice}
        minPrice={product.minPrice}
        maxPrice={product.maxPrice}
        currency={'ден'}
      />
    </Box>
  );
};

// TODO: Start using rem's for the card
const normalSizes = [124, 176, 216];
const emphasizedSizes = [232, 296, 376];
const normalSizesWithPadding = [156, 212, 248];
const emphasizedSizesWithPadding = [264, 328, 408];
const horizontalSizes = [316, 460, 560];

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
      height={emphasized ? emphasizedSizes : normalSizes}
      minWidth={horizontal ? normalSizes : undefined}
      maxWidth={horizontal ? normalSizes : undefined}
      justify='center'
      align='center'
      // @ts-ignore
      style={{ position: 'relative' }}
      mb={horizontal ? 0 : 4}
      mr={horizontal ? [4, 5, 5] : 0}
    >
      <ProductTags t={t} product={product} />
      {/* <ActionsOverlay /> */}

      <Image
        height={emphasized ? emphasizedSizes : normalSizes}
        getSrc={params =>
          sdk.artifact.getUrlForImage(product.images[0], storeId, params)
        }
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
//     <Fixed align='center' justify='center'>
//       <Overlay />
//       <Button sizelglarge' mr={1} leftIcon={<ZoomInOutlined />} />
//       <Button
//         size='lg'
//         ml={1}
//         leftIcon={<ShoppingCartOutlined />}
//
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
    <HoverableLink href='/products/[pid]' as={`/products/${product._id}`}>
      <Flex
        direction={horizontal ? 'row' : 'column'}
        p={[1, 3, 3]}
        my={2}
        width={
          horizontal && !emphasized
            ? horizontalSizes
            : emphasized
            ? emphasizedSizesWithPadding
            : normalSizesWithPadding
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
          horizontal={horizontal}
        />
      </Flex>
    </HoverableLink>
  );
};
