import React from "react";
import { Heading, Flex, Box, Image, Text } from "@la-mk/blocks-ui";
import { useTheme } from "@chakra-ui/react";
import { TFunction, useTranslation } from "next-i18next";
import { Product } from "../../domain/product";
import { Store } from "../../domain/store";
import { Price } from "./Price";
import { getImageURL } from "../../hacks/imageUrl";
import { HoverableLink } from "../HoverableLink";
import { ProductTags } from "./ProductTags";
import { urls } from "../../tooling/url";

const ProductDescription = ({
  t,
  product,
  store,
  detailed,
  horizontal,
  ownTheme,
}: {
  t: TFunction;
  product: Product;
  store: Store;
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
        as="h3"
        size="sm"
        noOfLines={headingLines}
        // @ts-ignore
        textTransform={ownTheme.description.heading?.textTransform}
      >
        {product.name}
      </Heading>

      {detailed && (
        <Text as="p" color="mutedText.dark" whiteSpace="pre-wrap" noOfLines={3}>
          {product.description}
        </Text>
      )}

      <Price
        minCalculatedPrice={product.minCalculatedPrice ?? 0}
        maxCalculatedPrice={product.maxCalculatedPrice ?? 0}
        minPrice={product.minPrice ?? 0}
        maxPrice={product.maxPrice ?? 0}
        currency={t(`currencies.${store.preferences?.currency ?? "mkd"}`)}
      />
    </Box>
  );
};

const ProductImage = ({
  store,
  product,
  horizontal,
  width,
  height,
  t,
}: {
  store: Store;
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
      justify="center"
      align="center"
      // @ts-ignore
      style={{ position: "relative" }}
      mb={horizontal ? 0 : 4}
      mr={horizontal ? [4, 5, 5] : 0}
    >
      <ProductTags t={t} product={product} />
      {/* <ActionsOverlay /> */}

      <Image
        style={{ objectFit: "contain" }}
        height={height}
        getSrc={(params) =>
          getImageURL(product.media[0]?._id, store._id, params)
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
  store,
  detailed,
  emphasized,
  horizontal,
}: {
  product: Product;
  store: Store;
  detailed?: boolean;
  emphasized?: boolean;
  horizontal?: boolean;
}) => {
  const { t } = useTranslation("translation");
  const theme = useTheme();
  const ownTheme = theme.sections.ProductCard;
  let selector = emphasized ? "emphasized" : "default";
  // Use horizontal only if it exists in theme
  if (horizontal && ownTheme.card.width.horizontal) {
    selector = "horizontal";
  }

  return (
    <HoverableLink
      href={`${urls.products}/[pid]`}
      as={`${urls.products}/${product._id}`}
    >
      <Flex
        direction={selector === "horizontal" ? "row" : "column"}
        bg={ownTheme.card.background}
        p={[1, 3, 3]}
        my={2}
        width={ownTheme.card.width[selector]}
      >
        <ProductImage
          t={t}
          store={store}
          product={product}
          horizontal={selector === "horizontal"}
          height={ownTheme.image.height[selector]}
          width={ownTheme.image.width[selector]}
        />

        <ProductDescription
          t={t}
          store={store}
          ownTheme={ownTheme}
          product={product}
          detailed={detailed}
          horizontal={selector === "horizontal"}
        />
      </Flex>
    </HoverableLink>
  );
};
