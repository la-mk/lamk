import React from 'react';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import { Title, Flex, Box, Paragraph, Image } from '@sradevski/blocks-ui';
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
    <Box py={horizontal ? 3 : 0}>
      <Title mb={2} level={3} fontSize={[1, 2, 2]} ellipsis={{ rows: 2 }}>
        {product.name}
      </Title>

      {detailed && (
        <Paragraph
          color='mutedText.dark'
          style={{ whiteSpace: 'pre-wrap' }}
          ellipsis={{ rows: 3 }}
        >
          {product.description}
        </Paragraph>
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

const normalSizes = [128, 176, 216];
const emphasizedSizes = [236, 296, 376];
const normalSizesWithPadding = [160, 212, 248];
const emphasizedSizesWithPadding = [268, 328, 408];
const horizontalSizees = [320, 460, 560];

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
      justifyContent='center'
      alignItems='center'
      style={{ position: 'relative' }}
      mb={horizontal ? 0 : 3}
      mr={horizontal ? [3, 3, 4] : 0}
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
    <HoverableLink href='/products/[pid]' as={`/products/${product._id}`}>
      <Flex
        flexDirection={horizontal ? 'row' : 'column'}
        p={[2, 3, 3]}
        my={2}
        width={
          horizontal && !emphasized
            ? horizontalSizees
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
