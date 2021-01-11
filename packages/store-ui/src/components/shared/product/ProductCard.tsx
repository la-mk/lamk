import React from 'react';
import { Product } from '@la-mk/la-sdk/dist/models/product';
import { sdk } from '@la-mk/la-sdk';
import { Heading, Flex, Box, Image, Text } from '@la-mk/blocks-ui';
import { Price } from './Price';
import { useTranslation } from '../../../common/i18n';
import { useTheme } from '@chakra-ui/react';

import { TFunction } from 'next-i18next';
import { HoverableLink } from '../components/HoverableLink';
import { ProductTags } from './ProductTags';

const ProductDescription = ({
  product,
  detailed,
  horizontal,
  ownTheme,
}: {
  product: Product;
  detailed?: boolean;
  horizontal?: boolean;
  ownTheme: {
    description: {
      heading?: {
        textTransform: string;
      };
    };
  };
}) => {
  const headingLines = 2;
  /* Make sure the heading always occupies the same height */
  // const headingHeight =`${
  //   headingLines +
  //   (theme.components.Heading.sizes.sm.lineHeight * headingLines -
  //     headingLines)
  // }em`

  return (
    <Box py={horizontal ? 5 : 0}>
      <Heading
        mb={2}
        as='h3'
        size='sm'
        noOfLines={headingLines}
        // @ts-ignore
        textTransform={ownTheme.description.heading?.textTransform}
      >
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

const ProductImage = ({
  storeId,
  product,
  horizontal,
  width,
  height,
  t,
}: {
  storeId: string;
  product: Product;
  emphasized?: boolean;
  horizontal?: boolean;
  width: number[];
  height: number[];
  t: TFunction;
}) => {
  return (
    <Flex
      height={height}
      minWidth={horizontal ? width : undefined}
      maxWidth={horizontal ? width : undefined}
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
        style={{ objectFit: 'contain' }}
        height={height}
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
  const theme = useTheme();
  const ownTheme = theme.sections.ProductCard;
  let selector = emphasized ? 'emphasized' : 'default';
  // Use horizontal only if it exists in theme
  if (horizontal && ownTheme.card.width.horizontal) {
    selector = 'horizontal';
  }

  return (
    <HoverableLink href='/products/[pid]' as={`/products/${product._id}`}>
      <Flex
        direction={selector === 'horizontal' ? 'row' : 'column'}
        bg={ownTheme.card.background}
        p={[1, 3, 3]}
        my={2}
        width={ownTheme.card.width[selector]}
      >
        <ProductImage
          t={t}
          storeId={storeId}
          product={product}
          horizontal={selector === 'horizontal'}
          height={ownTheme.image.height[selector]}
          width={ownTheme.image.width[selector]}
        />

        <ProductDescription
          ownTheme={ownTheme}
          product={product}
          detailed={detailed}
          horizontal={selector === 'horizontal'}
        />
      </Flex>
    </HoverableLink>
  );
};
