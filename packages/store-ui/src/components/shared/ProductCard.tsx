import React from 'react';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import { Title, Flex, Image, Box, Paragraph } from '@sradevski/blocks-ui';
import { Price } from './Price';
import { useTranslation } from '../../common/i18n';

import { TFunction } from 'next-i18next';
import { HoverableLink } from './components/HoverableLink';
import { ProductTags } from './ProductTags';

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
      <Title mb={2} level={3} fontSize={[1, 2, 2]} ellipsis={{ rows: 2 }}>
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
      minWidth={horizontal ? ['120px', '140px', '180px'] : undefined}
      maxWidth={horizontal ? ['120px', '140px', '180px'] : undefined}
      justifyContent='center'
      alignItems='center'
      style={{ position: 'relative' }}
      mb={horizontal ? 0 : 4}
      mr={horizontal ? 3 : 0}
    >
      <ProductTags t={t} product={product} />
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
    <HoverableLink href='/products/[pid]' as={`/products/${product._id}`}>
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
    </HoverableLink>
  );
};
