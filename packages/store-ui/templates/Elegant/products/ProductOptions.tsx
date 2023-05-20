import difference from "lodash/difference";
import uniq from "lodash/uniq";
import { isEqual, omitBy, isNil } from "lodash";
import React from "react";
import { Flex, Text, Button, Input, PickerBoxes, Box } from "@la-mk/blocks-ui";
import Link from "next/link";
import { Attributes, Product, Variant } from "../../../domain/product";
import { TFunction, useTranslation } from "next-i18next";
import { CartWithProducts } from "../../../domain/cart";
import { urls } from "../../../tooling/url";

export const areObjectsEquivalent = (
  a: object | undefined,
  b: object | undefined
) => {
  return isEqual(omitBy(a, isNil), omitBy(b, isNil));
};

const getColorNames = (color: string | undefined, t: TFunction): string => {
  color = color?.toUpperCase();
  if (color === "#800000") {
    return t("wood.walnut");
  } else if (color === "#FFD700") {
    return t("wood.cherry");
  }
  return "";
};

const getColorCodes = (colorName: string | undefined, t: TFunction): string => {
  if (colorName === t("wood.walnut")) {
    return "#800000";
  } else if (colorName === t("wood.cherry")) {
    return "#FFD700";
  }
  return "";
};

export const ProductOptions = ({
  product,
  cart,
  selectedVariant,
  outOfStock,
  chosenAttributes,
  setChosenAttributes,
  quantity,
  setQuantity,
  handleAddToCart,
}: {
  product: Product;
  cart: CartWithProducts;
  selectedVariant?: Variant | null;
  outOfStock: boolean;
  chosenAttributes?: Attributes;
  setChosenAttributes: (attributes: Attributes) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleAddToCart: () => void;
}) => {
  const { t } = useTranslation("translation");
  const { t: tCustom } = useTranslation("custom");

  const isProductInCart =
    cart &&
    cart.items &&
    cart.items.some(
      (item) =>
        item.product._id === product._id &&
        areObjectsEquivalent(
          item.product?.attributes,
          selectedVariant?.attributes
        )
    );

  const allColors = uniq(
    product.variants
      .map((variant) => variant.attributes?.color)
      .filter((x) => !!x) as string[]
  );

  const allSizes = uniq(
    product.variants
      .map((variant) => variant.attributes?.size)
      .filter((x) => !!x) as string[]
  );

  const variantsWithStock = product.variants.filter(
    (variant) => variant.stock == null || variant.stock > 0
  );

  const remainingColorChoices = chosenAttributes?.size
    ? (variantsWithStock
        .filter((variant) => variant.attributes?.size === chosenAttributes.size)
        .map((variant) => variant.attributes?.color)
        .filter((x) => !!x) as string[])
    : (variantsWithStock
        .map((variant) => variant.attributes?.color)
        .filter((x) => !!x) as string[]);

  const remainingSizeChoices = chosenAttributes?.color
    ? (variantsWithStock
        .filter(
          (variant) => variant.attributes?.color === chosenAttributes.color
        )
        .map((variant) => variant.attributes?.size)
        .filter((x) => !!x) as string[])
    : (variantsWithStock
        .map((variant) => variant.attributes?.size)
        .filter((x) => !!x) as string[]);

  const disabledSizeChoices = difference(allSizes, remainingSizeChoices);
  const disabledColorChoices = difference(allColors, remainingColorChoices);

  return (
    <>
      {/* TODO: This is a hack for mokudo where the colors indicate material, otherwise we should use color variant of the picker */}
      {allColors.length > 0 && (
        <Flex align="center" justify="center" mt={3}>
          <Text mr={2}>{tCustom("wood.type")}:</Text>
          <PickerBoxes
            size="sm"
            disabled={disabledColorChoices}
            values={allColors.map((color) => getColorNames(color, tCustom))}
            selected={getColorNames(chosenAttributes?.color, tCustom)}
            onSelect={(color: string | undefined) =>
              setChosenAttributes({
                ...(chosenAttributes ?? {}),
                color: getColorCodes(color, tCustom),
              })
            }
          />
        </Flex>
      )}

      {allSizes.length > 0 && (
        <Flex align="center" justify="center" mt={3}>
          <Text mr={2}>{t("attributes.size")}:</Text>
          <PickerBoxes
            size="sm"
            disabled={disabledSizeChoices}
            values={allSizes}
            selected={chosenAttributes?.size}
            onSelect={(size: string | undefined) =>
              setChosenAttributes({ ...(chosenAttributes ?? {}), size })
            }
          />
        </Flex>
      )}

      <Flex width={"100%"} mt={[4, 6, 6]} direction="column" align="flex-start">
        {!isProductInCart && (
          <>
            <Input
              type="number"
              isDisabled={outOfStock || !selectedVariant}
              width="7rem"
              size="lg"
              min={1}
              max={selectedVariant?.stock || 9999}
              value={quantity}
              onChange={(_e, val) => setQuantity(val as number)}
            />
          </>
        )}
        <Box width={"100%"} mt={6}>
          {isProductInCart ? (
            <>
              <Text color="mutedText.dark">
                {t("cart.productAlreadyInCart")}
              </Text>
              <Link passHref href={urls.cart}>
                <Button variant="outline" mt={5} isFullWidth as="a" size="lg">
                  {t("actions.goToCart")}
                </Button>
              </Link>
            </>
          ) : (
            <Button
              isFullWidth
              isDisabled={outOfStock || !selectedVariant}
              onClick={handleAddToCart}
              variant={outOfStock ? "outline" : "solid"}
              size="lg"
            >
              {outOfStock ? t("product.outOfStock") : t("actions.addToCart")}
            </Button>
          )}
        </Box>
      </Flex>
    </>
  );
};
